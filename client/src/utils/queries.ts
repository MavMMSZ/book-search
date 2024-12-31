import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;

export const QUERY_BOOKS = gql`
  query getBooks {
    books {
      _id
      title
      authors
      description
      image
      link
    }
  }
`;

export const QUERY_BOOK = gql`
  query getBook($bookId: String!) {
    book(bookId: $bookId) {
      _id
      title
      authors
      description
      image
      link
    }
  }
`;

export const QUERY_SEARCH = gql`
  query searchBooks($search: String!) {
    searchBooks(search: $search) {
      _id
      title
      authors
      description
      image
      link
    }
  }
`;

export const QUERY_ME_BASIC = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const QUERY_USER_BASIC = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
    }
  }
`;

export const QUERY_BOOKS_BASIC = gql`
  query getBooks {
    books {
      _id
      title
    }
  }
`;

export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
