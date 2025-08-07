import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async register (data: User): Promise<any> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await this.userService.create({ ...data, password: hashedPassword });

        return this.generateToken(newUser);
    }

    async login (email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if ( !user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciales invalidas')
        }
        return this.generateToken(user);
    }

    private generateToken(user: User): any {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, name: user.name, role: user.role, }
        }
    }

}
