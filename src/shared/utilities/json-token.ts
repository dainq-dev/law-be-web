import { JsonToken } from '../interface/token.interface';

export class JsonTokenHelper {
  /**
   * Create a new token entry
   */
  static createTokenEntry(
    token: string,
    expiresIn: number,
    deviceInfo: string = 'Web Browser',
    ipAddress: string = '127.0.0.1',
  ): JsonToken {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresIn * 1000);

    return {
      token,
      created_at: now,
      expires_at: expiresAt,
      device_info: deviceInfo,
      ip_address: ipAddress,
    };
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(tokenEntry: JsonToken): boolean {
    return new Date() > tokenEntry.expires_at;
  }

  /**
   * Clean expired tokens from array
   */
  static cleanExpiredTokens(tokens: JsonToken[]): JsonToken[] {
    return tokens.filter(token => !this.isTokenExpired(token));
  }

  /**
   * Get active tokens count
   */
  static getActiveTokensCount(tokens: JsonToken[]): number {
    return this.cleanExpiredTokens(tokens).length;
  }

  /**
   * Find token in array
   */
  static findToken(tokens: JsonToken[], token: string): JsonToken | null {
    return tokens.find(t => t.token === token) || null;
  }

  /**
   * Remove token from array
   */
  static removeToken(tokens: JsonToken[], token: string): JsonToken[] {
    return tokens.filter(t => t.token !== token);
  }

  /**
   * Get token info for logging
   */
  static getTokenInfo(tokenEntry: JsonToken): {
    created_at: string;
    expires_at: string;
    device_info: string;
    ip_address: string;
    is_expired: boolean;
  } {
    return {
      created_at: tokenEntry.created_at.toISOString(),
      expires_at: tokenEntry.expires_at.toISOString(),
      device_info: tokenEntry.device_info,
      ip_address: tokenEntry.ip_address,
      is_expired: this.isTokenExpired(tokenEntry),
    };
  }
}