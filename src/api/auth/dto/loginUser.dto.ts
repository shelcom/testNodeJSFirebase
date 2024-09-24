import {IsEmail, IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securepassword123',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  password: string;
}
