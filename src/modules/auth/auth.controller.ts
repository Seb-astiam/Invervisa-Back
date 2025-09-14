import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}

    @Post('register')
    async register (@Body() body: CreateUserDto ) {
        return this.authService.register(body);
    }

    @Post('login')
    async login (@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }
}

