import gql from "graphql-tag";

export default gql`
  query ($id: ID) {
    course(id: $id) {
      id
      company_id
      course_name
      is_enroll
      is_shippable
      course_clicked_count
      total_purchased_by_users
      total_interseted_users_count
      course_objective
      course_cover_pic
      publishing_on
      total_duration
      chapter_count
      lecture_count
      course_video
      module_percentage
      course_slug
      sort_id
      course_feedback_avg
      course_feedback_count
      course_description
      course_status
      created_at
      is_training
      data_type

      trailers {
        name
        extension
        file_path
        youtube_link
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

      students {
        id
        username
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
            is_completed
          }
        }
      }

      reviews(first: 5, orderBy: [{ field: "created_at", order: DESC }]) {
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
  }
`;
