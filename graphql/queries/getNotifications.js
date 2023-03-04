import gql from "graphql-tag";

export default gql`
  query($cursor: Int $getAll:Boolean $getLikes:Boolean $getAnswers:Boolean $getComments:Boolean $getfollowers:Boolean) {
    me{
      id
      notifications(first: 10, page: $cursor, GetAll:$getAll, GetLikes: $getLikes, GetAnswers:$getAnswers, GetComments:$getComments, Getfollowers:$getfollowers) {
        data {
          id
          type
          message
          data
          notifiable_id
          read_at
          created_at
          sender {
            id
            firstname
            lastname
            profile_photo
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
