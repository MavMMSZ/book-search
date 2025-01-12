import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authenticateToken } from './services/auth.js';
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    const user = authenticateToken(token);
    return { user };
  },
});

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    app.use('/graphql', expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        if (!token) {
          throw new AuthenticationError('You must be logged in to query this schema');
        }

        const secretKey = process.env.JWT_SECRET_KEY || '';
        try {
          const decoded = jwt.verify(token, secretKey);
          return { user: decoded };
        } catch (err) {
          throw new AuthenticationError('You must be logged in to query this schema');
        }
      }
    }));
  });
};

startApolloServer();

// import express from 'express';
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import path from 'path';
// import cors from 'cors'; // Import cors for Cross-Origin support
// import dotenv from 'dotenv';
// import { typeDefs, resolvers } from './schemas/index.js';
// import db from './config/connection.js';
// import { authenticateToken } from './auth.js'; // Import the auth middleware

// dotenv.config(); // Load environment variables

// const PORT = process.env.PORT || 3001;
// const app = express();
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// const startApolloServer = async () => {
//   await server.start();

//   // Apply middleware
//   app.use(cors()); // Allow Cross-Origin requests
//   app.use(express.urlencoded({ extended: true }));
//   app.use(express.json());

//   // Apply authentication middleware for GraphQL
//   app.use(
//     '/graphql',
//     authenticateToken, // This ensures token authentication for every GraphQL request
//     expressMiddleware(server, {
//       context: ({ req }) => ({ user: req.user }), // Pass user info to the resolver context
//     })
//   );

//   // Serve static assets in production
//   if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/dist')));

//     app.get('*', (_req, res) => {
//       res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//     });
//   }

//   db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//   });
// };

// startApolloServer();

