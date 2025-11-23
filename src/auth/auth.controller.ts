import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Auth, GetRawHeaders, GetUser, RoleProtected } from './decorators';
import { UserRolGuard } from './guards/user-rol/user-rol.guard';
import { ValidRoles } from './interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
// Registrar un usuario 

@Post('register')
create(@Body() createUserDto: CreateUserDto) {
  return this.authService.create(createUserDto);
}
// ============================================================
// Verificar el estado del usuario
@Get('check-status')
@Auth(ValidRoles.ADMIN)
checkAuthStatus(@GetUser() user: User) {
  return this.authService.checkAuthStatus(user);
}
// ============================================================


  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.authService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(

    @Req() req: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[],

  ) {
    console.log("========================")
    console.log('REQ', req);
    console.log("========================")

    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      email: userEmail,
      rawHeaders

    }
  }
  @Get('private2')
  // @SetMetadata(META_ROLES, ['admin', 'super-user'])
  @RoleProtected(ValidRoles.ADMIN,)
  @UseGuards(AuthGuard(), UserRolGuard)

  testingPrivateRoute2(
    @GetUser() user: User,

  ) {
    return {
      ok: true,
      message: 'Hola mundo private2',
      user

    }
  }
  @Get('private3')
  @Auth(ValidRoles.ADMIN)
  testingPrivateRoute3(
    @GetUser() user: User,

  ) {
    return {
      ok: true,
      message: 'Hola mundo private3',
      user

    }
  }


}
