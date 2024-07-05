import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response.interface';
import { RegisterUserDto } from './dto/register-user.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}
  async create(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    const { password, ...userData } = createUserDto;

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(user);
      const { password: _, ...result } = savedUser;
      return result;

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {  // 'ER_DUP_ENTRY' for MySQL, '23505' for PostgreSQL
        throw new BadRequestException(`${createUserDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happened!');
    }
  }
  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDto);

    if (!user.id || !user.role) {
      throw new Error('User creation failed');
    }

    return {
      user: user as UserEntity,
      token: this.getJwtToken({ id: user.id, role: user.role })
    };
  }

  async login(loginDto: LoginDto):Promise<LoginResponse>{
    const {email, password}=loginDto;

    const user = await this.usersRepository.findOne({where:{email}})
    if(!user){
      throw new UnauthorizedException('no valid credentials - email'); 
    }
    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('no valid credentials - password'); 

    }

    const{password:_, ...rest}=user;

    return {
      user: rest, 
      token:this.getJwtToken({id: user.id, role: user.role} ),
    };
  
  }
  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findUserById(id: number){
    const user = await this.usersRepository.findOne({where:{id}})
    const{password:_, ...rest}=user;
    return rest
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload)
    return token;

  }
}
