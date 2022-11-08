import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/hash/hash.service';
import { BaseResultType } from 'src/common/type/base-result.type';
import { jwtConstants } from 'src/strategy/constants';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise <any> {
    const user = await this.userService.getUserByUsername(email);

    if (user && (await this.hashService.comparePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user.id
    };

    return {access_token: this.jwtService.sign(payload, {secret: jwtConstants.secret})}
  }
}
