import gql from "graphql-tag";

export default gql`
query {
    me {
      id
      companies(first:10, page:0){
        data{
          id
          title
          slug
          logo
          address
          city
          country
          state
          linked_in_profile
          executives{
            id
            firstname
            lastname
            email
            username
            profile_photo
          }
        }
      }
    }
  }
`;
