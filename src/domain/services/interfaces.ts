/**
 * Abstract service definition for a service that hashes a password
 */
export interface IPasswordHashingService {
  hashPassword(plaintext: string): Promise<string>;
  verifyPassword(candidate: string, hash: string): Promise<boolean>;
}
