import gql from "graphql-tag";

export default gql`
  mutation destroy_client_card($card_id: Int!) {
    destroy_client_card(card_id: $card_id) {
      message
      error
    }
  }
`;
