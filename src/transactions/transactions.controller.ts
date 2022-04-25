import {
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { GetUser } from './decorators/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private transactions: TransactionsService) {}

  @Get('/deposit/:amt')
  deposit(@GetUser() user, @Param('amt', ParseFloatPipe) amt: number) {
    return this.transactions.deposit(amt, user.accountNumber);
  }

  @Get('/withdraw/:amt')
  withdraw(@GetUser() user, @Param('amt', ParseFloatPipe) amt: number) {
    return this.transactions.withdraw(amt, user.accountNumber);
  }

  @Get('/transfer/:amt/:accountNumber')
  transfer(
    @GetUser() user,
    @Param('amt', ParseFloatPipe) amt: number,
    @Param('accountNumber') accountNumber: string,
  ) {
    return this.transactions.transfer(amt, user.accountNumber, accountNumber);
  }
}
