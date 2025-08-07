import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';


@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}

    @Post('register')
    async register (@Body() body: User ) {
        return this.authService.register(body);
    }

    @Post('login')
    async login (@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }
}

