// import type { Request, Response } from 'express';
import Book, { IBook } from '../models/Book';
import User, { IUser } from '../models/User';

const resolvers = {
    Query: {
        book: async (): Promise<IBook[] | null> => {
            try {
                return Book.find({});
            } catch (err) {
                console.error(err);
                return null;
            }
        },
        user: async (_parent: any, { _id }: { _id: string }): Promise<IUser[] | null> => {
            try {
                return User.find({ _id });
            } catch (err) {
                console.error(err);
                return null;
            }
        },
    },
    Mutation: {
        getSingleUser: async (_parent: any, args: { _id: string }): Promise<IUser | null> => {
            try {
            return User.findOne({ $or: [{ _id: args._id }, { username: args._id }] });
            } catch (err) {
                console.error('getSingleUser failed');
                return null;
            }
        },
        createUser: async (_parent: any, args: { username: string; email: string; password: string }): Promise<IUser | null> => {
            try {
                return User.create(args);
            } catch (err) {
                console.error("createUser failed");
                return null;
            }
        },
        login: async (_parent: any, args: { email: string; password: string }): Promise<IUser | null> => {
            try {
                const user = await User.findOne({ email: args.email });
                if (!user) {
                    throw new Error('Incorrect email or password');
                }
                const correctPw = await user.isCorrectPassword(args.password);
                if (!correctPw) {
                    throw new Error('Incorrect email or password');
                }
                return user;
            } catch (err) {
                console.error('login failed');
                return null;
            }
        },
        saveBook: async (_parent: any, args: { authors: string[]; description: string; title: string; bookId: string; image: string; link: string }, { req }: { req: any }): Promise<IUser | null> => { 
            try {
            return User.findOneAndUpdate(
                { _id: req.user._id },
                { $addToSet: { savedBooks: args } },
                { new: true, runValidators: true }
            );
            } catch (err) {
                console.error('saveBook failed');
                return null;
            }
        },
        deleteBook: async (_parent: any, args: { bookId: string }, { req }: { req: any }): Promise<IUser | null> => {
            try {
                return User.findOneAndUpdate(
                    { _id: req.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
            } catch (err) {
                console.error('deleteBook failed');
                return null;
            }
        }
    },
};

export default resolvers;