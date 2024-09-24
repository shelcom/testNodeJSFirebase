import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {IsEqualTo} from '@common/validators/isEqualTo.validator'; // Implement this custom validator

export class ChangePasswordDto {
  @ApiProperty({
    example: 'securepassword123',
    description: 'The current password of the user',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'securepassword22',
    description: 'The new password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, {message: 'New password must be at least 8 characters long'})
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'New password must contain at least one letter and one number',
  })
  newPassword: string;

  @ApiProperty({
    example: 'securepassword22',
    description: 'Confirmation of the new password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'New password confirmation must be at least 8 characters long',
  })
  @ValidateIf(o => o.newPassword)
  @IsEqualTo('newPassword', {
    message: 'New password confirmation does not match',
  })
  newPasswordConfirm: string;
}
