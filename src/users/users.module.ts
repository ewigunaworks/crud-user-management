import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/users.schema';
import { UsersService } from './users.service';
import { jwtConstants } from 'src/strategy/constants';
import { UsersController } from './users.controller';
import { HashService } from 'src/common/hash/hash.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { LocalStrategy } from 'src/strategy/local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '60d'
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, HashService, AuthService, JwtStrategy, LocalStrategy],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
