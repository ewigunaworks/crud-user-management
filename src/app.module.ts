import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { HashService } from './common/hash/hash.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`mongodb://${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`),
    UsersModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, AuthService, UsersService, HashService],
})
export class AppModule {}
