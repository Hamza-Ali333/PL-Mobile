import gql from "graphql-tag";

export default gql`
  mutation saveOfferDescription(
  $offer_id:Int
  $description:String
  $status:String
  $categories:[Int!]!
  $tags:[Int!]!
  $invites:[Int]
) {
    saveOfferDescription(
      offer_id:$offer_id
      description: $description
      status:$status
      categories:$categories
      tags:$tags
      invites:$invites
    ) {
      id
    }
  }
`;

