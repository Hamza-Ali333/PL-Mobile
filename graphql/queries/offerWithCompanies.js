import gql from "graphql-tag";

export default gql`
  query {
    me {
      id
      offerWithCompanies(first: 10, page: 0) {
        data {
          id
          title
          address
          logo
          offers(first: 10, page: 0) {
            data {
              visibility
              id
              title
              requestCount
            }
          }
        }
      }
    }
  }
`;
