import gql from "graphql-tag";

export default gql`
  mutation createQuestion(
    $title: String!
    $description: String
    $categories: [Int!]!
    $user_ids: [Int]
    $tag_ids: [Int!]!
    $emails: [String]
    $status: Int!
    $course_id: Int
    $meta_text: String
    $pictures: [Object]
    $videos: [Object]
  ) {
    createQuestion(
      question: $title
      description: $description
      categories: $categories
      tagged_users: $user_ids
      tagged_keywords: $tag_ids
      invite_users: $emails
      status: $status
      meta_text: $meta_text
      pictures: $pictures
      videos: $videos
      course_id: $course_id
    ) {
      id
      question
      description
      created_at
      voteStatus
      status
      saveForCurrentUser
      slug
      meta_text
      attachments {
        id
        url
        type
        width
        height
      }
      tags {
        id
        tag_title
      }
      users {
        id
        firstname
        lastname
        profile_photo
        color
        is_follower
      }
      likes(first: 1) {
        data {
          users {
            id
          }
        }
        paginatorInfo {
          total
        }
      }
      dislikes(first: 1) {
        data {
          users {
            id
          }
        }
        paginatorInfo {
          total
        }
      }
      answers(first: 1) {
        paginatorInfo {
          total
        }
      }
    }
  }
`;
