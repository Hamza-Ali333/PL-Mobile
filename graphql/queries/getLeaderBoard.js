import { gql } from "@apollo/client";

export default gql`
  query Leaderboard($category_id: Int, $month: Int, $year: Int, $tags: [Int]) {
    leaderboard(
      category_id: $category_id
      month: $month
      year: $year
      tags: $tags
    ) {
      profile_photo
      answer_count
      share
      total_progress
      username
      user_id
      firstname
      lastname
      color
      followers
      tagline
      user_answers_comment_count
      user_question_posted
      email
      count
      up_position
      down_position
    }
  }
`;
