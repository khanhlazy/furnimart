import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getMe(user: any): Promise<any>;
}
//# sourceMappingURL=auth.controller.d.ts.map