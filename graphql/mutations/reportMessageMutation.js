import gql from "graphql-tag";

export default gql`
  mutation questionAbuseReport($title: String! $question_id: Int! $tag: String!) {
    questionAbuseReport(title: $title question_id: $question_id tag: $tag){
    	message
    }
  }
`;
