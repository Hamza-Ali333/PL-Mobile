import gql from "graphql-tag";

export default gql`
  mutation updateQuestion(
    $id: Int!
    $question: String
    $description: String
    $categories: [Int!]!
    $tag_ids: [Int!]!
  ) {
    updateQuestion(
      id: $id
      question: $question
      description: $description
      categories: $categories
      tagged_keywords: $tag_ids
    ) {
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
