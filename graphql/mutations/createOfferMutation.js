import gql from "graphql-tag";

export default gql`
  mutation createOffer(
  $offer_id:Int
  $company:Int
  $status:String
  $title:String
  $description:String
  $from:Date
  $to:Date
  $award:String
) {
    createOffer(
      offer_id:$offer_id
      company: $company
      status: $status
      title: $title
      description: $description
      from:$from
      to:$to
      award:$award
    ) {
      id
    }
  }
`;

