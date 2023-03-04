import gql from "graphql-tag";

export default gql`
  mutation createOfferAttachment(
  $offer_id:Int
  $url:String
  $type:String
  $mime:String
  $size:String
) {
    createOfferAttachment(
      offer_id:$offer_id
      url: $url
      type: $type
      mime: $mime
      size:$size
    ) {
      id
    }
  }
`;