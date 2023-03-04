import gql from "graphql-tag";

export default gql`
  mutation (
    $card_holder_name: String!
    $expiry_month: String
    $expiry_year: String
    $card_number: String
    $card_cvv: String
    $card_type: String
    $card_id: Int
    $package_id: Int
    $course_id: Int
    $coupon_code: String
  ) {
    add_client_card(
      card_holder_name: $card_holder_name
      expiry_month: $expiry_month
      expiry_year: $expiry_year
      card_number: $card_number
      card_cvv: $card_cvv
      card_type: $card_type
      card_id: $card_id
      package_id: $package_id
      coupon_code: $coupon_code
      course_id: $course_id
    ) {
      status
      error_code
      error_description
      transaction_status
      validation_status
      transaction_type
      method
      amount
      currency
    }
  }
`;
