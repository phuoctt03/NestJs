import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CombinedAuthorGuard } from 'src/auth/guards/combined-author.guard';

@ApiTags('playlist')  
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @ApiBearerAuth()  
  @ApiOperation({ summary: 'Create a new playlist' })
  @ApiResponse({ status: 201, description: 'The playlist has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreatePlaylistDto }) 
  @UseGuards(JwtAuthGuard)
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all playlists' })
  @ApiResponse({ status: 200, description: 'List of all playlists.' })
  findAll() {
    return this.playlistService.findAll();
  }

  @Post(':id/views')
  @ApiOperation({ summary: 'Increment views of a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Views incremented successfully.' })
  @ApiResponse({ status: 404, description: 'Playlist not found.' })
  incrementViews(@Param('id') id: string) {
    return this.playlistService.incrementViews(id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist details.' })
  @ApiResponse({ status: 404, description: 'Playlist not found.' })
  findOne(@Param('id') id: string) {
    return this.playlistService.findOneVideo(id.toString());
  }

  @Patch(':id')
  @ApiBearerAuth()  
  @ApiOperation({ summary: 'Update a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist updated successfully.' })
  @ApiResponse({ status: 404, description: 'Playlist not found.' })
  @ApiBody({ type: UpdatePlaylistDto }) 
  @UseGuards(JwtAuthGuard, CombinedAuthorGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistService.update(id.toString(), updatePlaylistDto);
  }

  @Delete(':id')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Delete a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist removed successfully.' })
  @ApiResponse({ status: 404, description: 'Playlist not found.' })
  @UseGuards(JwtAuthGuard, CombinedAuthorGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(id.toString());
  }
}
