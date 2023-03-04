import gql from "graphql-tag";

export default gql`
  query ($cursor: Int, $typeInfo: String, $categories: [Int], $search: String) {
    me {
      id
      username
      courses(
        first: 10
        page: $cursor
        typeInfo: $typeInfo
        categories: $categories
        search: $search
      ) {
        data {
          id
          company_id
          course_name
          course_objective
          course_cover_pic
          course_video
          is_enroll
          is_training
          course_slug
          sort_id
          course_feedback_avg
          total_purchased_by_users
          course_feedback_count
          course_description
          course_status
          created_at
          trailers {
            name
            extension
            file_path
          }
          course_support_files {
            course_id
            file_path
            created_at
          }
          course_session {
            user_id
            course_id
            title
            url
            date
            is_paid
          }
          course_requirement(first: 5) {
            data {
              requirements
            }
          }
          users(first: 5) {
            data {
              id
              username
              firstname
              lastname
            }
          }
          categories(first: 5) {
            data {
              name
            }
          }
          course_setting {
            course_id
            manager_can_enroll
            course_rating
            email_on_review
            disable_instructor_message
            allow_unenroll_course
            algorithm
          }
          contents(first: 5) {
            data {
              course_id
              sort_id
              content_type
              created_at
              content_name
              content_modules {
                id
                content_id
                title
                slug
                document_path
                module_document_size
                module_document_original_name
                audio_path
                module_audio_size
                module_audio_original_name
                video_path
                module_video_size
                module_video_original_name
                module_video_duration
              }
            }
          }
          reviews(first: 5) {
            data {
              course_id
              user_id
              user {
                username
                firstname
                lastname
                profile_photo
              }
              rating
              review
              is_published
              readable_created_at
            }
            paginatorInfo {
              total
              lastItem
              currentPage
              hasMorePages
            }
          }
        }
        paginatorInfo {
          total
          lastItem
          currentPage
          hasMorePages
        }
      }
    }
  }
`;
