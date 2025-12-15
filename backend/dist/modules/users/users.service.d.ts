import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(userData: any): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    findAll(role?: string): Promise<UserDocument[]>;
    update(id: string, userData: any): Promise<UserDocument | null>;
    delete(id: string): Promise<UserDocument | null>;
}
//# sourceMappingURL=users.service.d.ts.map