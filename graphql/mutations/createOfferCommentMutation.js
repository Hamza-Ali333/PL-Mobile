import gql from "graphql-tag";

export default gql`
  mutation createRecommendationComment(
  $recommendation_id:Int!
  $comment:String!
) {
  createRecommendationComment(
    recommendation_id:$recommendation_id
      comment:$comment
    ) {
        id
        user
        comment_body
        is_verified
        created_at
    }
  }
`;

