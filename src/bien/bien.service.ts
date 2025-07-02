import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bien, BienDocument } from '../schemas/bien.schema';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';

@Injectable()
export class BienService {
  constructor(@InjectModel(Bien.name) private readonly bienModel: Model<BienDocument>) {}

  // ✅ Ajouter un bien
  async create(createBienDto: CreateBienDto): Promise<Bien> {
    const createdBien = new this.bienModel(createBienDto);
    return createdBien.save();
  }

  // ✅ Lister tous les biens non archivés
  async findAll(): Promise<Bien[]> {
    return this.bienModel.find({ archive: false }).exec(); // 🔁 évite les biens archivés
  }

  // ✅ Trouver un bien par ID
  async findOne(id: string): Promise<Bien | null> {
    return this.bienModel.findById(id).exec();
  }

  // ✅ Modifier un bien
  async update(id: string, updateBienDto: UpdateBienDto): Promise<Bien> {
    const updatedBien = await this.bienModel.findByIdAndUpdate(id, updateBienDto, { new: true }).exec();
    if (!updatedBien) {
      throw new NotFoundException(`Bien avec id ${id} non trouvé`);
    }
    return updatedBien;
  }

  // ✅ Archiver un bien
  async archiver(id: string): Promise<Bien> {
    const bien = await this.bienModel.findById(id).exec();
    if (!bien) {
      throw new NotFoundException(`Bien avec id ${id} non trouvé`);
    }
    bien.archive = true; // met à jour le champ `archive`
    bien.statut = 'archivé'; // (optionnel) indique aussi par statut
    return bien.save();
  }

  // ✅ Désarchiver un bien
  async desarchiver(id: string): Promise<Bien> {
    const bien = await this.bienModel.findById(id).exec();
    if (!bien) {
      throw new NotFoundException(`Bien avec id ${id} non trouvé`);
    }
    bien.archive = false;
    bien.statut = 'actif'; // ou "disponible", selon ton vocabulaire
    return bien.save();
  }

  // ✅ Liste des biens archivés
  async findArchives(): Promise<Bien[]> {
    return this.bienModel.find({ archive: true }).exec();
  }

  // ✅ Supprimer un bien
  async remove(id: string): Promise<void> {
    const result = await this.bienModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Bien avec id ${id} non trouvé`);
    }
  }
  // ✅ Statistiques globales
async getStatistiques() {
  const tousLesBiens = await this.bienModel.find().exec();

  const actifs = tousLesBiens.filter((b) => !b.archive);
  const archives = tousLesBiens.filter((b) => b.archive);

  const total = tousLesBiens.length;

  const repartitionParType = actifs.reduce((acc, bien) => {
    const type = bien.type || 'Inconnu';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    actifs: actifs.length,
    archives: archives.length,
    repartitionParType,
  };
}

}
