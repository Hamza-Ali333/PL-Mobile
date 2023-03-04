import gql from "graphql-tag";

export default gql`
  query ($ID: ID) {
    question(id: $ID) {
      id
      question
      created_at
      voteStatus
      saveForCurrentUser
      slug
      description
      meta_text
      attachments {
        url
      }
      tags {
        id
        tag_title
      }
      categories {
        id
      }
      invites {
        id
        firstname
        lastname
        email
      }
    }
  }
`;
