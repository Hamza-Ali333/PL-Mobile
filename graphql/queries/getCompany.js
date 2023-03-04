import gql from "graphql-tag";

export default gql`
  query($id: ID) {
    company(id: $id) {
      id
      title
      slug
      logo
      address
      city
      country
      state
      linked_in_profile
      executives {
        id
        firstname
        lastname
        email
        username
        profile_photo
      }
    }
  }
`;
