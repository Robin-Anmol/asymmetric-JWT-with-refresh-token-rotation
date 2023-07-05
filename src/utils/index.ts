export * from './otp.service';
import { setAccessToken } from './tokens/setAccessToken';
import { setRefreshToken } from './tokens/setRefreshToken';
import { verifyAccessToken } from './tokens/verifyAccessToken';
import { verifyRefreshToken } from './tokens/verifyRefreshToken';
interface Payload {
  userId: string;
  email: string;
}

interface DecodedToken {
  userId: string;
}

export { DecodedToken, Payload, setAccessToken, setRefreshToken, verifyAccessToken, verifyRefreshToken };
