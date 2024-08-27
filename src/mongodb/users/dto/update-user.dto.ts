import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Đảm bảo rằng các thuộc tính là tùy chọn và có thể được cập nhật
  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe',
    required: false,  // Thuộc tính này không bắt buộc
  })
  Username?: string;

  @ApiProperty({
    description: 'Password hash of the user',
    example: 'newhashedpassword123',
    required: false,  // Thuộc tính này không bắt buộc
  })
  PasswordHash?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe_new@example.com',
    required: false,  // Thuộc tính này không bắt buộc
  })
  Email?: string;
  
  @ApiProperty({
    description: 'Role of the user',
    example: 'user',
    required: false,  // Thuộc tính này không bắt buộc
  })
  Role?: string;
}
