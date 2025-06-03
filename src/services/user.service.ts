import { User } from '../models/user.model';

export class UserService {
  static async getById(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }
}