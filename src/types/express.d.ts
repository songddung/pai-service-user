import type { AuthClaims } from '../adapter/in/http/auth/token.verifier';

declare module 'express' {
  interface Request {
    auth?: {
      token: string;
      userId: string;
      profileId: string | number | null;
      profileType: 'parent' | 'child' | null;
      claims: AuthClaims;
    };
  }
}
