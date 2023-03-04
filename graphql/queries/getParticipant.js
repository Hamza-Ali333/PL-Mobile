import gql from "graphql-tag";

export default gql`
query($id: ID) {
  offerParticipant(id: $id) {
    id
    total
    correct
    isRevision
    user{
      id
      firstname
      lastname
      profile_photo
      username
    }
    answers{
      id
      answer
      mark
      question{
        id
        question
      }
    }

  }
}
`;