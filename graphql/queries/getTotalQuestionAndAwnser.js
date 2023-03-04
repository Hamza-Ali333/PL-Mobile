import gql from "graphql-tag";

export default getTotalQuestionAndAwnser = gql`
  query {
    me {
      id
      questions(first: 1) {
        paginatorInfo {
          total
          count
        }
      }
      answers(first: 1) {
        paginatorInfo {
          total
          count
        }
      }
    }
  }
`;
