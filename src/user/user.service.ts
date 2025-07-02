
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password'); // Exclure mot de passe
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true, select: '-password' },
    );
    if (!updatedUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return updatedUser;
  }
}
