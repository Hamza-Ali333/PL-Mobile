import gql from "graphql-tag";

export default gql`
  query ($otp: String) {
    confirm_deactivation(otp: $otp) {
      status
      message
    }
  }
`;
