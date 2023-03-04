import gql from "graphql-tag";

export default gql`
  mutation ($package_id: Int, $coupon_code: String) {
    coupen_check_web(package_id: $package_id, coupon_code: $coupon_code) {
      message
      error
      discount
      amount
    }
  }
`;
