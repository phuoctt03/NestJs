import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({
        description: 'Username of the user',
        example: 'johndoe',
    })
    Username: string;

    @ApiProperty({
        description: 'Password hash of the user',
        example: 'hashedpassword123',
    })
    PasswordHash: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'johndoe@example.com',
    })
    Email: string;
    
    @ApiProperty({
        description: 'Role of the user',
        example: 'admin',
    })
    Role: string;
}
