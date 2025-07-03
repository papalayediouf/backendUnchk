export class CreateUserDto {
  firstName: string;
  name: string;
  email: string;
  password: string;
  role?: string; // optionnel, si tu veux que ce soit fourni ou défini par défaut côté service
}
