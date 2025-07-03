import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../schemas/user.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@unchk.com';
    const existing = await this.userModel.findOne({ email: adminEmail });

    if (!existing) {
      const hashed = await bcrypt.hash('admin123', 10);
      await this.userModel.create({
        firstName: 'Admin',
        name: 'UNCHK',
        email: adminEmail,
        password: hashed,
        role: 'admin',
      });
      console.log('✅ Admin créé automatiquement');
    } else {
      console.log('ℹ️ Admin déjà existant');
    }
  }
}
