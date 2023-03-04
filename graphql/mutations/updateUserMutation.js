import gql from "graphql-tag";

export default gql`
  mutation update(
    $linkedin_profile: String
    $firstname: String!
    $lastname: String!
    $username: String!
    $tagline: String
    $address: String
    $description: String
  ) {
    updateUser(
      linkedin_profile: $linkedin_profile
      firstname: $firstname
      lastname: $lastname
      username: $username
      tagline: $tagline
      description: $description
      address: $address
    ) {
      id
      username
      firstname
      lastname
      profile_photo
      tagline
      email
      timestamp
      address
      description
      color
      is_follower
    }
  }
`;
