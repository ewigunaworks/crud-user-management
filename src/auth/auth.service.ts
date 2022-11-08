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

  /**
   * It takes an email and password, gets the user from the database, and compares the password to the
   * hashed password in the database
   * @param {string} email - string - The email address of the user
   * @param {string} password - The password that the user entered in the login form.
   * @returns The user object is being returned.
   */
  async validateUser(email: string, password: string): Promise <any> {
    const user = await this.userService.getUserByUsername(email);

    if (user && (await this.hashService.comparePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  /**
   * It takes a user object, creates a payload object, and then returns an access token
   * @param {any} user - any - this is the user object that is passed in from the controller.
   * @returns The access token is being returned.
   */
  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user.id
    };

    return {access_token: this.jwtService.sign(payload, {secret: jwtConstants.secret})}
  }
}
