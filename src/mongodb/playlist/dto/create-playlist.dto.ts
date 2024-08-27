import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistDto {
  
  @ApiProperty({
    description: 'Avatar of the user',
    example: 'https://example.com/avatar.jpg',
  })
  avtUser: string;

  @ApiProperty({
    description: 'Source of the playlist',
    example: 'https://example.com/source',
  })
  src: string;

  @ApiProperty({
    description: 'Name of the playlist',
    example: 'My Favorite Songs',
  })
  name: string;

  @ApiProperty({
    description: 'Author of the playlist',
    example: 'John Doe',
  })
  author: string;

  @ApiProperty({
    description: 'Number of times the playlist has been watched',
    example: '1234',
  })
  watched: string;

  @ApiProperty({
    description: 'Date of creation or update',
    example: '2024-07-31',
  })
  date: string;
}
