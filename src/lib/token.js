import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const generateToken = async (user) => {
  const alg = 'HS256';
  try {
    const token = await new SignJWT({ userId : user?._id })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);
    if (!token) return null;
    return token;
  } catch (error) {
    return null;
  }
};

export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret, {algorithms: ['HS256']});
    if(!payload) return false;
    return true;
  } catch (error) {
    return false;
  }
};