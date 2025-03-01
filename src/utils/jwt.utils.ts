import jwt from 'jsonwebtoken';
import { config } from '../config/environment.config';

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = '1d';

export const generateToken = () => {
  const payload = {
    text: "This is an object!"
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
