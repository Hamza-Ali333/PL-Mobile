import gql from "graphql-tag";

export default gql`
  mutation upload($file: Upload!) {
    upload(file: $file)
  }
`;
