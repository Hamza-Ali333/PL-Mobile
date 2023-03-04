import gql from "graphql-tag";

export default gql`
  query {
    me {
      id
      username
      firstname
      lastname
      is_pro
      is_authorized
      profile_photo
      tagline
      email
      address
      country
      timezone
      description
      timestamp
      color
      is_follower
      categories {
        id
        name
        code
      }
    }
  }
`;
