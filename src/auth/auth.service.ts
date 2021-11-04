import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
      private usersService: UserService,
      private jwtService: JwtService
      ) {}
      private readonly logger = new Logger(AuthService.name);
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && user.password === pass) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

      async login(user: any) {
        user = await this.usersService.findOneByUsername(user.username);
        const payload = { username: user.username, id: user._id };
        this.logger.warn(user.username)
        this.logger.warn(user)
        this.logger.warn("**********************")

        return {
          access_token: this.jwtService.sign(payload),
        };
      }

}
