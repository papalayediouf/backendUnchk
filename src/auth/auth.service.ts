import { Injectable , BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import {User , UserDocument} from '../schemas/user.schemas';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // injection du modèle User
       private jwtService: JwtService,
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
  async connexion(createAuthDto: CreateAuthDto): Promise<{ accessToken: string }> {
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
    // 3. Générer un token JWT
  const payload = { sub: user._id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };

  }
 
  // Mot de passe oublié
  // Cette fonction prend l'email de l'utilisateur et envoie un code de réinitial
 async forgotPassword(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');

    const codeReset = crypto.randomInt(100000, 999999).toString();
    const hashCode = crypto.createHash('sha256').update(codeReset).digest('hex');

    user.codeReset = hashCode;
    user.codeResetExpire = Date.now() + 3600000; // expire dans 1h
    await user.save();

    await this.sendEmail(user.email, codeReset);
    return 'Code de réinitialisation envoyé par email';
  }


  // Réinitialisation du mot de passe
  // Cette fonction prend l'email de l'utilisateur, le code de réinitialisation et le nouveau mot de passe
async resetPassword(email: string, code: string, newPassword: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');
    if (!user.codeReset || !user.codeResetExpire || user.codeResetExpire < Date.now()) {
      throw new BadRequestException('Code expiré ou invalide');
    }

    const hashCode = crypto.createHash('sha256').update(code).digest('hex');
    if (hashCode !== user.codeReset) {
      throw new BadRequestException('Code de réinitialisation incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.codeReset = undefined;
    user.codeResetExpire = undefined;
    await user.save();
    return 'Mot de passe réinitialisé avec succès';
  }



  // Fonction pour envoyer l'email
  private async sendEmail(to: string, code: string) {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      to,
      subject: 'Code de réinitialisation',
      text: `Votre code de réinitialisation est : ${code}`,
    });
  }



}
