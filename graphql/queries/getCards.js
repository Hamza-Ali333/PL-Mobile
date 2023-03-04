import gql from "graphql-tag";

export default gql`
  query {
    me {
      id
      username
      cards(first: 10) {
        data {
          card_id
          card_holder_name
          expiry_month
          expiry_year
          card_number
          card_cvv
          card_type
          card_preview
        }
      }
    }
  }
`;
