import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // random string of 10 characters
    const password = Math.random().toString(36).substring(2, 12);
    const hashedPassword = await argon.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: {
          accountNumber: createUserDto.accountNumber,
          hashedPassword: hashedPassword,
          name: createUserDto.name,
          email: createUserDto.email,
          balance: createUserDto.balance,
        },
      });
      delete user.hashedPassword;
      return {
        ...user,
        oneTimePassword: password,
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        console.log(err);
        if (err.code === 'P2002') {
          if (err.meta['target'].includes('email')) {
            throw new ForbiddenException('Email already exists');
          } else if (err.meta['target'].includes('accountNumber')) {
            throw new ForbiddenException('Account number already exists');
          }
        }
      }
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
