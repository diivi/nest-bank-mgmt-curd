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
    if (createUserDto.balance < 0) {
      throw new ForbiddenException('Balance can not be negative.');
    }
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

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.balance < 0) {
      throw new ForbiddenException('Balance can not be negative.');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    1;
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: updateUserDto.name || user.name,
        email: updateUserDto.email || user.email,
        balance: updateUserDto.balance || user.balance,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
