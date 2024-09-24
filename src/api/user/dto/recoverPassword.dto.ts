import {IsEmail, IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class RecoverPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
