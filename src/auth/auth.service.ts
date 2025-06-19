import { Injectable , BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {User , UserDocument} from '../schemas/user.schemas';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // injection du modèle User
  ) {}
 
  // Inscription
  async inscription(createAuthDto: CreateAuthDto): Promise<string> {
    const { firstName, name,   email, password, } = createAuthDto;

    // 1. Vérifier si l'utilisateur existe déjà
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('Un utilisateur avec cet email existe déjà.');
    }

    // 2. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Créer et enregistrer l'utilisateur
    const user = new this.userModel({
      firstName,
      name,
      
      email,
      password: hashedPassword,
      
    });

    await user.save();

    return 'Utilisateur inscrit avec succès.';
  }

  // Connexion
  async connexion(createAuthDto: CreateAuthDto): Promise<string> {
    const { email, password } = createAuthDto;

    // 1. Vérifier si l'utilisateur existe
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("L'utilisateur n'existe pas.");
    }

    // 2. Comparer les mots de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe incorrect.');
    }

    // 3. Connexion réussie (tu peux ici retourner un JWT plus tard)
    return 'Connexion réussie.';
  }
 
}
