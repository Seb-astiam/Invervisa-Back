export class CreateUserDto {
    // id: string;
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}