import gql from "graphql-tag";

export default gql`
  query ($id: ID) {
    user(id: $id) {
      id
      profile_photo
      large_photo: profile_photo(size: "large")
      small_photo: profile_photo(size: "small")
      firstname
      lastname
      username
      tagline
      color
      is_follower
      description
      country
      city
      companies(first: 10, page: 0) {
        data {
          id
          title
          linked_in_profile
        }
      }
      questions(first: 1) {
        data {
          id
          question
        }
        paginatorInfo {
          total
          count
          currentPage
          lastPage
        }
      }
      answers(first: 1) {
        data {
          id
          answer
        }
        paginatorInfo {
          total
          count
          currentPage
          lastPage
        }
      }
      followers(first: 5) {
        data {
          id
        }
        paginatorInfo {
          total
        }
      }
      workboards(first: 3) {
        data {
          job_title
          company_id
          address
          experience_year
          work_experience
          job_achievement
          company_name
          start_date
          progress
          skills(first: 3) {
            data {
              id
              title
            }
          }
        }
      }
    }
  }
`;
