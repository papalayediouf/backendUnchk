import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFavorisDto {
  @IsString()
  @IsNotEmpty()
  bienId: string;
}
