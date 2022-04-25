import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async deposit(amt: number, accountNumber: string) {
    try {
      if (amt < 0) {
        return {
          message: 'Deposit failed, amount can not be negative.',
        };
      }
      await this.prisma.transaction.create({
        data: {
          amount: amt,
          userFrom: {
            connect: {
              accountNumber,
            },
          },
          userTo: {
            connect: {
              accountNumber,
            },
          },
          type: 'DEPOSIT',
        },
      });
      const user = await this.prisma.user.update({
        where: {
          accountNumber,
        },
        data: {
          balance: {
            increment: amt,
          },
        },
      });
      delete user.hashedPassword;
      return {
        message: 'Deposit successful',
        user,
      };
    } catch (err) {
      console.log(err);
      return {
        message: 'Deposit failed',
      };
    }
  }

  async withdraw(amt: number, accountNumber: string) {
    try {
      if (amt < 0) {
        return {
          message: 'Withdraw failed, amount can not be negative.',
        };
      }
      const user = await this.prisma.user.findUnique({
        where: {
          accountNumber,
        },
      });
      if (user.balance < amt) {
        return {
          message: 'Withdraw failed, not enough balance.',
        };
      }

      await this.prisma.transaction.create({
        data: {
          amount: amt,
          userFrom: {
            connect: {
              accountNumber,
            },
          },
          userTo: {
            connect: {
              accountNumber,
            },
          },
          type: 'WITHDRAW',
        },
      });
      const updatedUser = await this.prisma.user.update({
        where: {
          accountNumber,
        },
        data: {
          balance: {
            decrement: amt,
          },
        },
      });
      delete updatedUser.hashedPassword;
      return {
        message: 'Withdraw successful',
        updatedUser,
      };
    } catch (err) {
      console.log(err);
      return {
        message: 'Withdraw failed',
      };
    }
  }

  async transfer(
    amt: number,
    fromAccountNumber: string,
    toAccountNumber: string,
  ) {
    try {
      if (amt < 0) {
        return {
          message: 'Transfer failed, amount can not be negative.',
        };
      }
      if (fromAccountNumber === toAccountNumber) {
        return {
          message: 'Transfer failed, can not transfer to same account.',
        };
      }
      const fromUser = await this.prisma.user.findUnique({
        where: {
          accountNumber: fromAccountNumber,
        },
      });
      if (fromUser.balance < amt) {
        return {
          message: 'Transfer failed, not enough balance.',
        };
      }
      await this.commissionTransaction(amt, fromAccountNumber);
      await this.prisma.transaction.create({
        data: {
          amount: amt,
          userFrom: {
            connect: {
              accountNumber: fromAccountNumber,
            },
          },
          userTo: {
            connect: {
              accountNumber: toAccountNumber,
            },
          },
          type: 'TRANSFER',
        },
      });
      await this.prisma.user.update({
        where: {
          accountNumber: fromAccountNumber,
        },
        data: {
          balance: {
            decrement: amt,
          },
        },
      });
      await this.prisma.user.update({
        where: {
          accountNumber: toAccountNumber,
        },
        data: {
          balance: {
            increment: amt,
          },
        },
      });
      return {
        message: 'Transfer successful',
      };
    } catch (err) {
      console.log(err);
      return {
        message: 'Transfer failed',
      };
    }
  }

  async commissionTransaction(amt: number, accountNumber: string) {
    try {
      const commission = amt * 0.02;
      await this.prisma.transaction.create({
        data: {
          amount: commission,
          userFrom: {
            connect: {
              accountNumber,
            },
          },
          userTo: {
            connect: {
              accountNumber: process.env.SUPER_USER_ACCOUNT,
            },
          },
          type: 'COMMISSION',
        },
      });
      await this.prisma.user.update({
        where: {
          accountNumber: process.env.SUPER_USER_ACCOUNT,
        },
        data: {
          balance: {
            increment: commission,
          },
        },
      });
      await this.prisma.user.update({
        where: {
          accountNumber,
        },
        data: {
          balance: {
            increment: -commission,
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
