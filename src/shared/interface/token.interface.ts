export interface JsonToken {
  token: string;
  created_at: Date;
  expires_at: Date;
  device_info: string;
  ip_address: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}
