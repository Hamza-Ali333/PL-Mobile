import gql from "graphql-tag";

export default gql`
  mutation AddFreeAccess(
    $orderIdOrPlainId: Int
    $order_type: CourseStatus
    $coupon_code: String
    $discount: String
    $amount: Float
  ) {
    addFreeAccess(
      orderIdOrPlainId: $orderIdOrPlainId
      order_type: $order_type
      coupon_code: $coupon_code
      discount: $discount
      amount: $amount
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
