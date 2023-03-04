import gql from "graphql-tag";

export default gql`
mutation offerParticipant(
    $id:Int
  ) {
    offerParticipant(
        id: $id
      ) {
        id
        isRevision
      }
    }
`;
