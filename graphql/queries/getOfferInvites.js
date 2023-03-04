import gql from "graphql-tag";

export default gql`
query ($cursor: Int $isInvitation:Boolean $isApplied:Boolean
  ){
    me{
      id
      offerInvites(first: 10, page: $cursor isInvitation:$isInvitation isApplied:$isApplied) {
        data {
          id
          title
          pivot{
            direction
            status
            user_id
          }
          user{
            id
            username
          }
          company{
            id
            logo
            title
          }
        }
        paginatorInfo{
          total
        }
      }
    }
}
`;