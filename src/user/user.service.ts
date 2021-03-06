import { ForbiddenException, Injectable } from '@nestjs/common';
import { FirstSignInDto } from './dto/first-signin-dto';
import { SignInDto } from './dto/sign-in.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async firstSignIn(firstSignInDto: FirstSignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: firstSignInDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Email or password is incorrect');
    }
    const isValid = await argon.verify(
      user.hashedPassword,
      firstSignInDto.oldPassword,
    );
    if (!isValid) {
      throw new ForbiddenException('Email or password is incorrect');
    }
    await this.prisma.user.update({
      where: {
        email: firstSignInDto.email,
      },
      data: {
        hashedPassword: await argon.hash(firstSignInDto.newPassword),
        passwordChanged: true,
      },
    });
    return this.signToken(user.accountNumber, user.email);
  }

  async signIn(signInUserDto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInUserDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Email or password is incorrect');
    }
    const passwordChanged = user.passwordChanged;
    if (!passwordChanged) {
      throw new ForbiddenException('You need to change your password');
    }
    const isValid = await argon.verify(
      user.hashedPassword,
      signInUserDto.password,
    );
    if (!isValid) {
      throw new ForbiddenException('Email or password is incorrect');
    }
    return this.signToken(user.accountNumber, user.email);
  }

  signToken(accountNumber: string, email: string) {
    const data = {
      sub: accountNumber,
      email,
    };
    return {
      access_token: this.jwt.sign(data, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
