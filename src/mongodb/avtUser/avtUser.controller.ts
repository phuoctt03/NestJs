import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, UploadedFile, Delete, UseGuards } from '@nestjs/common';
import { AvtUserService } from './avtUser.service';
import { UpdateAvtUserDto } from './dto/update-avtUser.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CombinedUserGuard } from 'src/auth/guards/combined-user.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('AvtUser')
@Controller('AvtUser')
export class AvtUserController {
  constructor(private readonly avtUserService: AvtUserService) {}

  @Post('upload/:id')
  @ApiOperation({ summary: 'Upload a new avtUser' })
  @ApiResponse({ status: 201, description: 'The avtUser has been successfully created.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be uploaded',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {  
    return this.avtUserService.upload(file, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all avtUser' })
  @ApiResponse({ status: 200, description: 'Return all avtUser.' })
  findAll() {
    return this.avtUserService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a avtUser by ID' })
  @ApiResponse({ status: 200, description: 'Return a avtUser by ID.' })
  @UseGuards(JwtAuthGuard, CombinedUserGuard)
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'The ID of the avtUser' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.avtUserService.findMany(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a avtUser by ID' })
  @ApiResponse({ status: 200, description: 'Return the updated avtUser.' })
  @UseGuards(JwtAuthGuard, CombinedUserGuard)
  @Roles('admin')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateAvtUserDto: UpdateAvtUserDto) {
    return this.avtUserService.update(id, updateAvtUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a avtUser by UserID' })
  @ApiResponse({ status: 200, description: 'Return the deleted avtUser.' })
  @UseGuards(JwtAuthGuard, CombinedUserGuard)
  @Roles('admin')
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Query() query: { avatarUrl?: string }) {
    return this.avtUserService.remove(id, query);
  }

}
