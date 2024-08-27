import { PartialType } from '@nestjs/mapped-types';
import { CreateAvtUserDto } from './create-avtUser.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAvtUserDto extends PartialType(CreateAvtUserDto) {

  @ApiPropertyOptional({
    description: 'The avatar URL of the user',
    example: 'https://example.com/new-avatar.jpg',
  })
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'The ID of the user use avt',
    example: '1',
  })
  UserID?: string;

  @ApiPropertyOptional({
    description: 'The state of the avt or ID of the user use avt',
    example: 'public or 1 or private',
  })
  state?: string;
}
