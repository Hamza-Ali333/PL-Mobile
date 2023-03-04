import gql from "graphql-tag";

export default gql`
  mutation (
    $card_holder_name: String
    $expiry_month: String
    $expiry_year: String
    $card_number: String
    $card_cvv: String
    $card_type: String
  ) {
    add_clint_card(
      card_holder_name: $card_holder_name
      expiry_month: $expiry_month
      expiry_year: $expiry_year
      card_number: $card_number
      card_cvv: $card_cvv
      card_type: $card_type
    ) {
      card_holder_name
      expiry_month
      card_preview
    }
  }
`;
