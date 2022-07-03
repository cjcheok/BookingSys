import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports:[
    UserModule,
    SharedModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
