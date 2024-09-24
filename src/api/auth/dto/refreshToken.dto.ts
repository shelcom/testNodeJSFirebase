import {IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmZjM3ZmE2LWYxY2YtNDlmMy1hZGIzLWIwNTg2ZjIwNmQyMSIsImlhdCI6MTcyMjY3NTU1OCwiZXhwIjoxNzIzODg1MTU4fQ.sSKki1_sLV7YP8HJCnWdreaIKSVaZ30Ar4d43nqkidg',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
