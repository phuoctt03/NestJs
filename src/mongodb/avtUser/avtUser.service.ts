import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvtUserDto } from './dto/create-avtUser.dto';
import { UpdateAvtUserDto } from './dto/update-avtUser.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import * as fs from 'fs';

@Injectable()
export class AvtUserService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(file: Express.Multer.File, id: string) {
    if (!file) {
      throw new Error('No file uploaded'); 
    }
    const admin = await this.prisma.users.findFirst({where: {Role: 'admin'}});
    const type = path.extname(file.originalname).split('.').pop();
    const hash = createHash('sha256').update(file.buffer).digest('hex');
    const fullFileName = `${id}.${hash}.${type}`;
    const filePublic = `${admin?.id}.${hash}.${type}`
    let filePath = `http://localhost:3002/avt/${fullFileName}`;
    let filePublicPath = `http://localhost:3002/avt/${filePublic}`;
    let avt = await this.prisma.avtUser.findFirst({
      where:{ 
        OR:[
          {avatarUrl: filePath},
          {avatarUrl: filePublicPath}
        ]
      }
    });
    if (avt) {
      return "Tệp đã tồn tại";
    }

    const destination = `public/avt/${fullFileName}`;
    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(destination, file.buffer);

    if (id === `${admin?.id}`) {
      await this.prisma.avtUser.create({
        data: {
          avatarUrl: filePath,
          UserID: '',
          state: 'public',
        },
      });
    } else {
      await this.prisma.avtUser.create({
        data: {
          avatarUrl: filePath,
          UserID: id,
          state: 'private',
        },
      });
    }

    await this.prisma.avtUser.deleteMany({
      where: { UserID: id, state: id },
    });

    await this.prisma.avtUser.create({
      data: {
        avatarUrl: filePath,
        UserID: id,
        state: id,
      },
    });

    let user = await this.prisma.users.findFirst({where: {id}});
    await this.prisma.playlist.updateMany({
      where: { author: user?.Username},
      data: {
        avtUser : filePath,
      },
    });

    console.log('File uploaded successfully');
    return {file:{filePath}};
  }

  async create(createAvtUserDto: CreateAvtUserDto) {
    return this.prisma.avtUser.create({
      data: createAvtUserDto,
    });
  }

  async findAll() {
    return this.prisma.avtUser.findMany({ where: { state: 'public' } });
  }

  async findMany(id: string) {
    return await this.prisma.avtUser.findMany({
      where: { UserID: id, state: 'private'},
    });
  }

  async update(id: string, updateAvtUserDto: UpdateAvtUserDto) {
    let result = await this.prisma.avtUser.updateMany({
      where: {
        UserID: id, 
        state: id,  
      },
      data: updateAvtUserDto,
    });
    let user = await this.prisma.users.findFirst({where: {id}});
    await this.prisma.playlist.updateMany({
      where: { author: user?.Username },
      data: {
        avtUser : updateAvtUserDto.avatarUrl,
      },
    });
    let avtURL = await this.prisma.avtUser.findFirst({where: {state: 'public'}});
    if (result.count === 0) {
      await this.prisma.avtUser.create({
        data: {
          avatarUrl: updateAvtUserDto.avatarUrl || avtURL?.avatarUrl || '',
          UserID: id,
          state: id,
        },
      });
      console.log(`Avt với UserID: ${id} chưa tồn tại. Đã tạo mới thành công`);  
      return;
    }
    console.log(`Avt với UserID: ${id} đã được cập nhật thành công`);
    return result;
  }

  async remove(id: string, updateAvtUserDto: UpdateAvtUserDto) {

    if (updateAvtUserDto.avatarUrl === '') {
      return 'Không có Avt nào được xóa';
    }

    await this.prisma.avtUser.deleteMany({
      where: { avatarUrl: updateAvtUserDto.avatarUrl },
    });

    let avt = await this.prisma.avtUser.findFirst({
      where: { UserID: id, state: id },
    });
    
    let avtPublic = await this.prisma.avtUser.findFirst({where: {state: 'public'}, select: {avatarUrl: true}});
    if (!avt){
      let user = await this.prisma.users.findUnique({where: {id}});
      await this.prisma.playlist.updateMany({
        where: { author: user?.Username },
        data: {
          avtUser : avtPublic?.avatarUrl,
        },
      });
      await this.prisma.avtUser.create({
        data: {
          avatarUrl: avtPublic?.avatarUrl || '',
          UserID: id,
          state: id,
        },
      });
    }

    const parts = updateAvtUserDto.avatarUrl?.split('/');
    const filename = parts?.pop();

    if (filename) {
      const filePath = "public/avt/" + filename;
      try {
        await fsPromises.unlink(filePath);
        console.log(`Xóa tệp ${filename} thành công.`);
      } catch (error) {
        console.log(`Có lỗi xảy ra khi xóa tệp ${filename}: ${error.message}`);
      }
    }

    console.log(`Xóa Avt có Url = ${updateAvtUserDto.avatarUrl} thành công`);
    return { 
      message: `Xóa Avt có Url = ${updateAvtUserDto.avatarUrl} thành công`,
      file: {filePath: avtPublic?.avatarUrl}
    };
  }
}
