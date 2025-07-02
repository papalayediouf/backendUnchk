export class CreateBienDto {
  readonly titre: string;
  readonly type: string;
  readonly statut: string;
  readonly prix: number;
  readonly superficie: number;
  readonly localisation: string;
  readonly description?: string;
  readonly images?: string[];
}
