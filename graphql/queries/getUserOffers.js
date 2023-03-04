import gql from "graphql-tag";

export default gql`
query ($cursor: Int $id:ID){
    user(id:$id) {
      id
      offers(first: 10 page:$cursor) {
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