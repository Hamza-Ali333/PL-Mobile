import gql from "graphql-tag";

export default gql`
  query {
    plans {
      id
      name
      validity
      description
      price
      discount
      credits
      path
    }
  }
`;
