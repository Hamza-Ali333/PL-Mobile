import gql from "graphql-tag";

export default gql`
  query ($id: Int) {
    getCertificate(course_id: $id) {
      course_id
      learner_id
      certificate_id
      certificate_number
      expires_on
      naadac
    }
  }
`;
