import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Playlist[]> {
    return this.prisma.playlist.findMany();
  }

  async create(createVideoDto: CreatePlaylistDto): Promise<string> {
  const playlist = await this.prisma.playlist.create({
    data: {
      UID: '1',
      avtUser: createVideoDto.avtUser,
      src: createVideoDto.src,
      name: createVideoDto.name,
      author: createVideoDto.author,
      watched: createVideoDto.watched,
      date: createVideoDto.date,
    },
  });
  console.log(`Tạo video thành công: ${playlist}`);
  return 'Tạo video thành công';
  }

  async findOneVideo(id: string): Promise<Playlist | null> {
    const video = await this.prisma.playlist.findFirst({
      where: { id },
    });
    if (!video) {
      console.log(`Không tìm thấy video có ID = ${id}`);
    } else {
      console.log(`Lấy video có id = ${id} thành công`);
    }
    return video;
  }

  async update(id: string, updateVideoDto: UpdatePlaylistDto): Promise<string> {
    const vid = await this.findOneVideo(id);
    if (!vid) {
      console.log(`Không tìm thấy video có ID = ${id}`);
      return 'Không tìm thấy video';
    }
    await this.prisma.playlist.update({
      where: { id },
      data: updateVideoDto,
    });
    console.log(`Cập nhật video có id = ${id} thành công`);
    return 'Video đã được cập nhật thành công';
  }

  async remove(id: string): Promise<string> {
    const vid = await this.findOneVideo(id);
    if (!vid) {
      console.log(`Không tìm thấy video có ID = ${id}`);
      throw new NotFoundException(`Không tìm thấy video có ID = ${id}`);
    }
    await this.prisma.playlist.delete({
      where: { id },
    });
    console.log(`Xóa video có id = ${id} thành công`);
    return `Video có ID ${id} đã được xóa thành công`;
  }

  generateRandomUID(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async incrementViews(id: string) {
    let UID = this.generateRandomUID(10);
    const max = 100;
    let retry = 0;
    while (true){
      try {
        let video = await this.prisma.playlist.findUnique({ where: { id } });
        let update = await this.prisma.playlist.update({
          where: { id, UID: video?.UID },
          data: {
            watched: `${Number(video?.watched) + 1}`,
            UID
          },
        });
        if(update.UID === UID){
          console.log(`Tăng views video có id = ${id} thành công lên ${update.watched}, UID = ${UID}`);
          break;
        }
      } catch (error) {
        if(retry >= max){
          console.log(`Tăng views video có id = ${id} thất bại`);
          break;
        }
        retry++;
      }
    }
  }
}
