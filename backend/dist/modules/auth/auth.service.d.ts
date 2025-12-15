import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dtos/auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            phone: any;
            address: any;
            isActive: any;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            phone: any;
            address: any;
            isActive: any;
        };
    }>;
    private generateToken;
    private formatUserResponse;
}
//# sourceMappingURL=auth.service.d.ts.map