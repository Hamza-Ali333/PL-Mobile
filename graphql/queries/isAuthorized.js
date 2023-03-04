import gql from "graphql-tag";

export default gql`
  query {
    authorizedUser {
      id
      username
      firstname
      lastname
      is_authorized
    }
  }
`;
