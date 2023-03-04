import gql from "graphql-tag";

export default gql`
  mutation createCompany(
  $company_id:Int
  $title:String
  $link:String
  $logo:String
  $executives:[Int]
) {
    createCompany(
      company_id:$company_id
      title: $title
      link: $link
      logo: $logo
      executives:$executives
    ) {
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
`;

