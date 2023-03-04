import gql from "graphql-tag";

export default gql`
  query($cursor: Int) {
    offers(
      first: 10,
      Me:true,
      draft:true,
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
      attachment{
        id
        url
        type
        size
      }
      questions{
        id
        question
      }
      invites{
        id
        firstname,
        lastname,
        email
      }
      categories{
        id
      }
      tags{
        id
        tag_title
      }
      company{
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
      paginatorInfo {
        total
        lastItem
        currentPage
        hasMorePages
      }
    }
  }
`;