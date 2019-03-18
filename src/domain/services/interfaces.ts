/**
 * Abstract service definition for a service that hashes a password
 */
export interface IPasswordHashingService {
  hashPassword(plaintext: string): Promise<string>;
  verify(candidate: string, hash: string): Promise<boolean>;
}
