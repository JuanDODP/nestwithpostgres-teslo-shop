import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interface/jwt.interface.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }
  async create(CreateUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = CreateUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete (user as any).password;

      return {
        ...user,
        token: await this.getJwtToken({ id: user.id })
      };
      //  TOdo : retornar el JWT
    } catch (error) {
      // Manejo de errores (por ejemplo, email duplicado)
      console.log('Ese es el error')
      console.log(error)
      console.log('Ese es el error')
      this.handleDBErrors(error);
    }

    return `Esta acción crea un nuevo usuario con los datos: ${JSON.stringify(CreateUserDto)}`;
  }
// Verificar el estado del usuario
  async checkAuthStatus( user: User ) {
    return {
      ...user,
      token: await this.getJwtToken({ id: user.id })
    };
  }
// ============================================================
  async login(loginUserDto: LoginUserDto) {
    // return `Esta acción loguea un usuario con los datos: ${JSON.stringify(loginUserDto)}`;
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException('Credenciales incorrectas - email');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales incorrectas - password');

    return {
      ...user,
      token: await this.getJwtToken({ id: user.id })

    };
  }

  // obtener y generar un nuevo JWT
  private async getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }
  private handleDBErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(`El registro ya existe en la base de datos: ${error.detail}`);
    }
    console.log(error);
    throw new InternalServerErrorException('Error inesperado, revisar logs del servidor');
  }


}
