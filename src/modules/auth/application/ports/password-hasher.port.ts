export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface PasswordHasher {
  compare(password: string, hash: string): Promise<boolean>;
}
