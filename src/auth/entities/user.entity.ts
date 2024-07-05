import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Column, Entity,  PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('user')
@Unique(['email'])

export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @MinLength(6)
  password?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'USER' })
  @IsString()
  role: string;

  @Column()
  @IsInt()
  edad: number;
}

