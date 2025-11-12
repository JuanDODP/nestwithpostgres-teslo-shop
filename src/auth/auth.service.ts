import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

      return user;
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

  private handleDBErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(`El registro ya existe en la base de datos: ${error.detail}`);
    }
    console.log(error);
    throw new InternalServerErrorException('Error inesperado, revisar logs del servidor');
  }


}
