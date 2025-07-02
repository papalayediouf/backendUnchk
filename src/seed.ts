// src/seed.ts
import { config } from 'dotenv';
config(); // ← charge les variables d'environnement

import { connect, model } from 'mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import * as bcrypt from 'bcryptjs';

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGO_URI non défini dans le fichier .env');
    process.exit(1);
  }

  await connect(uri);
  const UserModel = model<User>('User', UserSchema);

  const existing = await UserModel.findOne({ email: 'admin@unchk.com' });
  if (existing) {
    console.log('ℹ️ Admin déjà existant');
  } else {
    const hashed = await bcrypt.hash('admin123', 10);
    await UserModel.create({
      firstName: 'Admin',
      name: 'UNCHK',
      email: 'admin@unchk.com',
      password: hashed,
      role: 'admin',
    });
    console.log('✅ Admin créé avec succès');
  }

  process.exit();
}

seedAdmin();
//