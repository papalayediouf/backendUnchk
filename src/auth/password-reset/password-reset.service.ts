import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schemas';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';


@Injectable()
export class PasswordResetService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');

    const codeReset = crypto.randomInt(100000, 999999).toString();
    const hashCode = crypto.createHash('sha256').update(codeReset).digest('hex');

    user.codeReset = hashCode;
    user.codeResetExpire = Date.now() + 3600000;
    await user.save();

    await this.sendEmail(user.email, codeReset);
    return 'Code de réinitialisation envoyé par email';
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');

    if (!user.codeReset || !user.codeResetExpire || user.codeResetExpire < Date.now()) {
      throw new BadRequestException('Code expiré ou invalide');
    }

    const hashCode = crypto.createHash('sha256').update(code).digest('hex');
    if (hashCode !== user.codeReset) {
      throw new BadRequestException('Code incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.codeReset = undefined;
    user.codeResetExpire = undefined;
    await user.save();

    return 'Mot de passe réinitialisé avec succès';
  }

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
