import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ← Très important
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'ta_clef_secrete_super_secure', // ← doit correspondre
    });
  }

  async validate(payload: any) {
    // Ce que tu retournes ici sera dans req.user
    return { sub: payload.sub, email: payload.email };
  }
}
