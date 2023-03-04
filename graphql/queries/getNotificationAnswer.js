import gql from "graphql-tag";

export default gql`
  query ($ID: ID, $cursor: Int) {
    question(id: $ID) {
      id
      question
      description
      created_at
      voteStatus
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
      answers(
        first: 10
        page: $cursor
        orderBy: [{ field: "created_at", order: DESC }]
      ) {
        data {
          id
          answer
          voteStatus
          created_at
          users {
            id
            firstname
            lastname
            profile_photo
            color
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
          comments(first: 4) {
            data {
              comment
            }
            paginatorInfo {
              total
            }
          }
        }
        paginatorInfo {
          total
          lastItem
          currentPage
          hasMorePages
        }
      }
    }
  }
`;
