import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; 
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../../auth/constants'; 

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.users.findFirst({ 
      where: { 
        OR: [
          {Username: createUserDto.Username },
          {Email: createUserDto.Email }
        ]  
      }
    });

    if (user) {
      return 'Tên người dùng hoặc email đã được sử dụng';
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.PasswordHash, 10);
      createUserDto.Role = 'user';
      const newUser = await this.prisma.users.create({
        data: {
          ...createUserDto,
          PasswordHash: hashedPassword,
        },
      });
      const avtPublic = await this.prisma.avtUser.findFirst({where: {state: 'public'}});
      await this.prisma.avtUser.create({
        data: {
          UserID: `${newUser.id}`,
          state: `${newUser.id}`,
          avatarUrl: `${avtPublic?.avatarUrl}`,
        },
      });
      console.log(newUser);
      return 'Tạo tài khoản thành công';
    } catch (error) {
      console.error('Đã xảy ra lỗi khi tạo tài khoản:', error);
    }
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOneUserName(Username: string) {
    try {
      const user = await this.prisma.users.findFirst({ where: { Username } });
      console.log('Lấy người dùng có Username = ' + Username);
      return user;
    } catch (error) {
      console.error('Đã xảy ra lỗi khi tìm kiếm người dùngtheo tên người dùng:', error);
      return null;
    }
  }
  
  async findOne(id: string) {
    try {
      const user = await this.prisma.users.findFirst({ where: { id } });
      console.log(`Lấy người dùng có ID =  + ${id}`);
      return user;
    } catch (error) {
      console.error('Đã xảy ra lỗi khi tìm kiếm người dùng theo ID:', error);
      return null;
    }
    
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const authorVideo = user?.Username;
    if (!user) {
      console.log(`Không tìm thấy người dùng với ID = ${id}`);
      return `Không tìm thấy người dùng với ID = ${id}`;
    }
    let edit = await this.prisma.users.findFirst({
      where: {
        OR: [
          { Username: updateUserDto.Username },
          { Email: updateUserDto.Email }
        ]
      }
    });    

    if (edit && edit.id != user.id) {
      console.log('Tên người dùng hoặc email đã được sử dụng');
      return 'Tên người dùng hoặc email đã được sử dụng';
    }

    if (updateUserDto.PasswordHash  === '') {
      updateUserDto.PasswordHash = user.PasswordHash;
    }

    if (updateUserDto.PasswordHash !== user.PasswordHash) {
      const hashedPassword = await bcrypt.hash(updateUserDto.PasswordHash || '', 10);
      updateUserDto.PasswordHash = hashedPassword;
    }

    try {
      await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });

      await this.prisma.playlist.updateMany({
        where: { author: authorVideo },
        data: { author: updateUserDto.Username },
      });
    } catch (error) {
      console.error('Đã xảy ra lỗi khi cập nhật người dùng:', error);
    }
    console.log(`Người dùng với ID: ${id} đã được cập nhật thành công`);
    return `Người dùng với ID: ${id} đã được cập nhật thành công`;
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.prisma.users.delete({ where: { id } });
      await this.prisma.avtUser.deleteMany({ where: { state: 'private', UserID: id } });
      await this.prisma.playlist.deleteMany({ where: { author: user?.Username } });
      console.log(`Xóa người dùng có ID = ${id} thành công`);
      return `Người dùng với ID = ${id} đã được xóa thành công`;
    } catch (error) {
      console.error('Đã xảy ra lỗi khi xóa người dùng:', error);
    }
  }

  async checkin(username: string, password: string) {
    const user = await this.findOneUserName(username);

    if (!user) {
      console.log('Người dùng không tồn tại');
      return 'Người dùng không tồn tại';
    }

    if (!await bcrypt.compare(password, String(user.PasswordHash))) {
      console.log('Mật khẩu không chính xác');
      return 'Mật khẩu không chính xác';
    } 
    
    console.log('Đăng nhập thành công');

    let userId = user.id;

    let avtUser = await this.prisma.avtUser.findFirst({
      where: {
        UserID: userId,
        state: userId,
      }
    });
    
    const payload = {
      username: user.Username,
      sub: user.id,
      roles: user.Role,
    };
    const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: '1d' });
    const data = {
      token: token,
      id : user.id,
      role: user.Role,
      username: user.Username,
      email: user.Email,
      avt: avtUser?.avatarUrl,
    }

    return data ;
  }

  async repass(username: string, newPassword: string, email: string): Promise<string> {
    const user = await this.findOneUserName(username);

    if (!user) {
      console.log('Người dùng không tồn tại');
      return 'Người dùng không tồn tại';
    }

    if (user.Email !== email) {
      console.log('Email không khớp với người dùng');
      return 'Email không khớp với người dùng';
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { id: user.id },
      data: { PasswordHash: hashedPassword },
    });
    console.log('Đổi mật khẩu thành công');
    return 'Đổi mật khẩu thành công';
  }
}
