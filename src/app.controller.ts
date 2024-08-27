import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express'; 

@Controller('api')
export class AppController {

  @Get('user')
  @Roles('user') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUser(@Request() req: ExpressRequest) { 
    
    console.log(req.user);
    console.log("Xác thực thành công");
  }
}
