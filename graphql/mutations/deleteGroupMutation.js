import gql from "graphql-tag";

export default gql`
  mutation ($id: Int) {
    deleteGroup(id: $id) {
      id
      name
      description
      created_by
      image_path
    }
  }
`;
