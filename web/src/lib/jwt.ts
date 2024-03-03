import { decodeJwt, jwtVerify } from "jose";

export const decodeToken = (token: string | null) => {
  try {
    if (token) {
      return decodeJwt(token);
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const verifyToken = async (token: string | null) => {
  try {
    if (token) {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET)
      );

      return payload;
    }
    return null;
  } catch (error) {
    return false;
  }
};
