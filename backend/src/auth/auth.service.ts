import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private admin = {
    id: 0,
    username: 'admin',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$/6iWl0+G0XBTdp4WWGvcVg$0UZ4pg8qcbwkRmR3L3/GSEOYIAVTvnyuZzkm53JTj4M',
  };

  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signin(dto: SignInDto) {
    try {
      const is_password_right = await argon.verify(
        this.admin.password,
        dto.password,
      );

      if (dto.username !== this.admin.username || !is_password_right) {
        return new ForbiddenException('Invalid credentials');
      }

      const access_token = await this.signToken(
        this.admin.id,
        this.admin.username,
      );
      return { access_token };
    } catch (err) {
      return new InternalServerErrorException(err);
    }
  }

  async signToken(id: number, username: string): Promise<string> {
    const payload = { sub: id, username };

    return this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async getMe(token: string) {
    if (!token) {
      throw new ForbiddenException('No token provided');
    }
    const tokenWithoutBearer = token.replace(/^Bearer\s/, '');

    try {
      const payload = await this.jwt.verifyAsync(tokenWithoutBearer, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return {
        id: payload.sub,
        username: payload.username,
      };
    } catch (err) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
