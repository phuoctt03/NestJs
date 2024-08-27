import { ApiProperty } from '@nestjs/swagger';

export class CreateAvtUserDto {

  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl: string;

  @ApiProperty({
    description: 'The ID of the user use avt',
    example: '1',
  })
  UserID: string;

  @ApiProperty({
    description: 'The state of the avt or ID of the user use avt',
    example: 'public or 1 or private',
  })
  state: string;
}
