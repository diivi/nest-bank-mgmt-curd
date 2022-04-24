import { Body, Controller, Post } from '@nestjs/common';
import { FirstSignInDto } from './dto/first-signin-dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('first-sign-in')
  signIn(@Body() firstSignInDto: FirstSignInDto) {
    return this.userService.firstSignIn(firstSignInDto);
  }
}
