import gql from "graphql-tag";

export default gql`
  mutation deleteRecommendationComment($id: Int!) {
    deleteRecommendationComment(id: $id) {
      id
    }
  }
`;
