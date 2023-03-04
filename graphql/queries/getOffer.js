import gql from "graphql-tag";

export default gql`
  query ($id: ID) {
    offer(id: $id) {
      id
      title
      description
      from
      to
      award
      type
      status
      isPublic
      visibility
      isLiked
      isWatched
      isBookmarked
      isAuthor
      isRequestSent
      isAccess
      isExpired
      isRevision
      offerAnswerType
      totalLikes
      user {
        id
        username
      }
      users(first: 5) {
        data {
          id
          username
          firstname
          lastname
        }
      }
      attachment {
        id
        url
        type
        size
      }
      questions {
        id
        question
      }
      invites {
        id
        firstname
        lastname
        email
      }
      categories {
        id
      }
      tags {
        id
        tag_title
      }
      company {
        id
        title
        slug
        logo
        address
        city
        country
        state
      }
    }
  }
`;
