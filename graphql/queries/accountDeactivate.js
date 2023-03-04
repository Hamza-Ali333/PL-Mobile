import gql from "graphql-tag";

export default gql`
  query {
    deactivate {
      status
      message
    }
  }
`;
