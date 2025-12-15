import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<any>;
    findById(id: string): Promise<any>;
    findAll(): Promise<any[]>;
    update(id: string, userData: any): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
    private formatUserResponse;
}
//# sourceMappingURL=users.controller.d.ts.map