import gql from "graphql-tag";

export default gql`
  query {
    me {
      id
      getTotalMessage
      backup_info
    }
  }
`;
