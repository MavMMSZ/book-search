// import type { Request, Response, NextFunction } from 'express';
// import { GraphQLError } from 'graphql';
// import jwt from 'jsonwebtoken';

// import dotenv from 'dotenv';
// dotenv.config();

// // Define JWT payload interface
// interface JwtPayload {
//   _id: string;
//   username: string;
//   email: string;
// }

// // Middleware to authenticate JWT token
// export const authenticateToken = (req: Request & { user?: JwtPayload }, _: Response, next: NextFunction) => {
//   // Retrieve Authorization header
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     // Extract token from the header
//     const token = authHeader.split(' ')[1];

//     // Get secret key from environment variables
//     const secretKey = process.env.JWT_SECRET_KEY || '';

//     // Verify JWT token
//     jwt.verify(token, secretKey, (err, decoded) => {
//       if (err) {
//         throw new GraphQLError('Forbidden', {
//           extensions: { code: 'FORBIDDEN' },
//         });
//       }

//       // Attach decoded user info to the request object
//       req.user = decoded as JwtPayload;
//       return next();
//     });
//   } else {
//     throw new GraphQLError('Unauthorized', {
//       extensions: { code: 'UNAUTHORIZED' },
//     });
//   }
// };

// // Function to sign a JWT token
// export const signToken = (username: string, email: string, _id: string) => {
//   // Create payload
//   const payload = { username, email, _id };

//   // Get secret key from environment variables
//   const secretKey = process.env.JWT_SECRET_KEY || '';

//   // Generate JWT token with 1-hour expiry
//   return jwt.sign(payload, secretKey, { expiresIn: '1h' });
// };
import type { Request, Response, NextFunction } from 'express';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Define JWT payload interface
interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

// Middleware to authenticate JWT token
export const authenticateToken = (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authorization header is missing.',
    });
  }

  const token = authHeader.split(' ')[1]; // Extract the token (Bearer <token>)
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (!secretKey) {
    return res.status(500).json({
      message: 'JWT secret key is not configured.',
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: 'Invalid or expired token.',
      });
    }

    // Attach the user info to the request object
    req.user = decoded as JwtPayload;
    next();
  });
};

// Function to sign a new JWT token
export const signToken = (username: string, email: string, _id: string): string => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (!secretKey) {
    throw new Error('JWT secret key is not configured.');
  }

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Helper function to verify a token and decode its payload
export const verifyToken = (token: string): JwtPayload | null => {
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (!secretKey) {
    throw new Error('JWT secret key is not configured.');
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
};
