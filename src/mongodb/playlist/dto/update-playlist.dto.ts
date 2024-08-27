import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaylistDto } from './create-playlist.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {
  @ApiProperty({
    description: 'Avatar of the user',
    example: 'https://example.com/new-avatar.jpg',
    required: false,  // Thuộc tính này không bắt buộc
  })
  avtUser?: string;

  @ApiProperty({
    description: 'Source of the playlist',
    example: 'https://example.com/new-source',
    required: false,  // Thuộc tính này không bắt buộc
  })
  src?: string;

  @ApiProperty({
    description: 'Name of the playlist',
    example: 'Updated Playlist Name',
    required: false,  // Thuộc tính này không bắt buộc
  })
  name?: string;

  @ApiProperty({
    description: 'Author of the playlist',
    example: 'Jane Doe',
    required: false,  // Thuộc tính này không bắt buộc
  })
  author?: string;

  @ApiProperty({
    description: 'Number of times the playlist has been watched',
    example: '5678',
    required: false,  // Thuộc tính này không bắt buộc
  })
  watched?: string;

  @ApiProperty({
    description: 'Date of creation or update',
    example: '2024-08-01',
    required: false,  // Thuộc tính này không bắt buộc
  })
  date?: string;
}
