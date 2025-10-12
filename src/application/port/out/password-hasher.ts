export interface PasswordHasher {
  hash(rawPassword: string): Promise<string>;
  compare(rawPassword: string, hashedPassword: string): Promise<boolean>;
}
