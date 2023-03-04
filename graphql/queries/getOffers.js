import gql from "graphql-tag";

export default gql`
  query(
    $cursor: Int
    $me: Boolean
    $public: Boolean
    $saved: Boolean
    $active: Boolean
    $expired: Boolean
    $work_in_progress: Boolean
    $submited: Boolean
    $awarded: Boolean
    $visibility: String
    $tags: [Int]
    $category: Int
    $search: String
  ) {
    offers(
      first: 10
      me: $me
      public: $public
      saved: $saved
      active: $active
      expired: $expired
      work_in_progress: $work_in_progress
      submited: $submited
      awarded: $awarded
      visibility: $visibility
      tags: $tags
      category: $category
      search: $search
      page: $cursor
    ) {
      data {
        id
        title
        description
        from
        to
        award
        type
        status
        visibility
        isLiked
        totalLikes
        isBookmarked
        isAccess
        isAuthor
        isWatched
        user{
          id
          username
        }
        attachment {
          id
          url
          type
          size
        }
        tags {
          id
          tag_title
        }
        categories {
          id
          name
        }
        company {
          id
          title
          slug
          logo
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
`;
