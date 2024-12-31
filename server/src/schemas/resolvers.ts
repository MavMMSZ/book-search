import Book, { IBook } from '../models/Book';
import User, { IUser } from '../models/User';

const resolvers = {
    Query: {
        book: async (): Promise<IBook[] | null> => {
            return Book.find({});
        },
        user: async (_parent: any, { _id }: { _id: string }): Promise<IUser[] | null> => {
            const params = _id ? { _id } : {};
            return User.find(params);
        },
    },
    Mutation: {
        createBook: async (_parent: any, args: any): Promise<IBook | null> => {
            const book = await Book.create(args);
            return book;
        },
        createUser: async (_parent: any, args: any): Promise<IUser | null> => {
            const user = await User.create(args);
            return user;
        },
        saveBook: async (_parent: any, { _id, bookId }: { _id: string, bookId: string }): Promise<IUser | null> => {
            const updatedUser = await User.findOneAndUpdate(
                { _id },
                { $addToSet: { savedBooks: bookId } },
                { new: true }
            );
            return updatedUser;
        },
        deleteBook: async (_parent: any, { _id, bookId }: { _id: string, bookId: string }): Promise<IUser | null> => {
            const updatedUser = await User.findOneAndUpdate( 
                { _id },
                { $pull: { savedBooks: bookId } },
                { new: true }
            );
            return updatedUser;
        }
        
    },
};

export default resolvers;