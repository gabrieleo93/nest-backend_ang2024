import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { authGuard } from './guards/auth.guard';
import { UserEntity } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }


  @Post('/login')
  login(@Body() loginDto: LoginDto){
   
    return  this.authService.login(loginDto);
  }

  @Post('/register')
    register(@Body()registerDto: RegisterUserDto){
      return  this.authService.register(registerDto);
    }
  

  @UseGuards(authGuard)  
  @Get()
  findAll(@Request() req: Request) {
    // console.log({req})
    // const user= req['user']
    return this.authService.findAll();

  }
  @UseGuards(authGuard)  
  @Get('/check-token')
  checkToken(@Request() req: Request){
    const user= req['user'] as UserEntity

    return{
      user,
      token: this.authService.getJwtToken({id: user.id, role: user.role} )
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
