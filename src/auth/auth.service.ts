import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User, UserDocument } from '../schemas/user.schemas';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // Inscription
  async inscription(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    const { firstName, name, email, password } = createAuthDto;

    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('Un utilisateur avec cet email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      firstName,
      name,
      email,
      password: hashedPassword,
      role: 'user',  // Ajouter un rôle par défaut
    });

    await user.save();

    return { message: 'Utilisateur inscrit avec succès.' };
  }

  // Connexion
  async connexion(createAuthDto: CreateAuthDto): Promise<{ token: string; user: { role: string; email: string } }> {
    const { email, password } = createAuthDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("L'utilisateur n'existe pas.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe incorrect.');
    }

    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        role: user.role,
        email: user.email,
        // ajoute d'autres infos si nécessaire
      }
    };
  }
}
