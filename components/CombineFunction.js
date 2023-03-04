import { Alert } from "react-native";
import getQuestions from "../graphql/queries/getQuestions";
import getOffer from "../graphql/queries/getOffer";
import getUser from "../graphql/queries/getUser";
import getNotificationAnswer from "../graphql/queries/getNotificationAnswer";
import likeQuestionMutation from "../graphql/mutations/likeQuestionMutation";
import unlikeQuestionMutation from "../graphql/mutations/unlikeQuestionMutation";
import saveQuestionMutation from "../graphql/mutations/saveQuestionMutation";
import unsaveQuestionMutation from "../graphql/mutations/unsaveQuestionMutation";
import likeAnswerMutation from "../graphql/mutations/likeAnswerMutation";
import unlikeAnswerMutation from "../graphql/mutations/unlikeAnswerMutation";
import followUserMutation from "../graphql/mutations/followUserMutation";
import unfollowUserMutation from "../graphql/mutations/unfollowUserMutation";
import offerLikeMutation from "../graphql/mutations/offerLikeMutation";
import offerUnLikeMutation from "../graphql/mutations/offerUnLikeMutation";
import offerSaveBookmark from "../graphql/mutations/offerSaveBookmark";
import offerUnSaveBookmark from "../graphql/mutations/offerUnSaveBookmark";
import offerInviteRequest from "../graphql/mutations/offerInviteRequest";
import offerWatchedMutation from "../graphql/mutations/offerWatchedMutation";
import offerUpdateStatusMutation from "../graphql/mutations/offerUpdateStatusMutation";

import getOfferStatus from "../graphql/queries/getOfferStatus";
import client from "../constants/client";

export const requestMiddleware = (id) => {
  return new Promise((resolve) => {
    client
      .query({
        query: getOfferStatus,
        variables: { id: id },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        if (
          result.data.offer.isAuthor === false &&
          result.data.offer.visibility != "1"
        ) {
          let status = "unpublished";
          if (result.data.offer.visibility === "3") {
            status = "cancelled";
          } else if (result.data.offer.visibility === "2") {
            status = "completed";
          }
          Alert.alert(
            "Action not perform",
            "Offer " + status + " by author",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch((error) => {});
  });
};

export const _handleLikePressed = (
  id,
  totalLikes,
  totalDislikes,
  voteStatus
) => {
  client.mutate({
    mutation: likeQuestionMutation,
    variables: {
      question_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      likeQuestion: {
        __typename: "QuestionLikeVote",
        total_like_votes: totalLikes,
        total_unlike_votes: totalDislikes,
      },
    },

    update: (store, { data: { likeQuestion } }) => {
      try {
        const data = store.readQuery({
          query: getQuestions,
        });

        const votedLink = data.questions.data.find((data) => data.id === id);

        votedLink.likes.paginatorInfo.total = likeQuestion.total_like_votes;
        votedLink.dislikes.paginatorInfo.total =
          likeQuestion.total_unlike_votes;
        votedLink.voteStatus = voteStatus === 1 ? -1 : 1;
        store.writeQuery({ query: getQuestions, data });
      } catch (e) {}
    },
  });
};

export const _handleDislikePressed = (
  id,
  totalLikes,
  totalDislikes,
  voteStatus
) => {
  client.mutate({
    mutation: unlikeQuestionMutation,
    variables: {
      question_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      dislikeQuestion: {
        __typename: "QuestionLikeVote",
        total_like_votes: totalLikes,
        total_unlike_votes: totalDislikes,
      },
    },

    update: (store, { data: { dislikeQuestion } }) => {
      try {
        const data = store.readQuery({
          query: getQuestions,
        });

        const votedLink = data.questions.data.find((data) => data.id === id);

        votedLink.likes.paginatorInfo.total = dislikeQuestion.total_like_votes;
        votedLink.dislikes.paginatorInfo.total =
          dislikeQuestion.total_unlike_votes;
        votedLink.voteStatus = voteStatus === 0 ? -1 : 0;
        store.writeQuery({ query: getQuestions, data });
      } catch (e) {}
    },
  });
};

export const _handleSavedPressed = (id) => {
  client.mutate({
    mutation: saveQuestionMutation,
    variables: {
      question_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      saveQuestion: {
        __typename: "saveQuestion",
        saveForCurrentUser: true,
        message: "",
      },
    },

    update: (store, { data: { saveQuestion } }) => {
      try {
        const data = store.readQuery({
          query: getQuestions,
          variables: {},
        });

        const saveItem = data.questions.data.find((data) => data.id === id);

        saveItem.saveForCurrentUser = true;
        store.writeQuery({ query: getQuestions, data });
      } catch (e) {}
    },
  });
};

export const _handleUnsavedPressed = (id) => {
  client.mutate({
    mutation: unsaveQuestionMutation,
    variables: {
      question_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      unsaveQuestion: {
        __typename: "saveQuestion",
        saveForCurrentUser: false,
        message: "",
      },
    },

    update: (store, { data: { unsaveQuestion } }) => {
      try {
        const data = store.readQuery({
          query: getQuestions,
          variables: {},
        });

        const saveItem = data.questions.data.find((data) => data.id === id);

        saveItem.saveForCurrentUser = false;
        store.writeQuery({ query: getQuestions, data });
      } catch (e) {}
    },
  });
};

export const _handleAnswerLikePressed = (
  id,
  aid,
  totalLikes,
  totalDislikes,
  voteStatus
) => {
  client.mutate({
    mutation: likeAnswerMutation,
    variables: {
      question_id: id,
      answer_id: aid,
    },
    optimisticResponse: {
      __typename: "Mutation",
      likeAnswer: {
        __typename: "AnswerLikeVote",
        total_like_votes: totalLikes,
        total_unlike_votes: totalDislikes,
      },
    },

    update: (store, { data: { likeAnswer } }) => {
      try {
        const data = store.readQuery({
          query: getNotificationAnswer,
          variables: { ID: id },
        });

        const votedLink = data.question.answers.data.find(
          (data) => data.id === aid
        );

        votedLink.likes.paginatorInfo.total = likeAnswer.total_like_votes;
        votedLink.dislikes.paginatorInfo.total = likeAnswer.total_unlike_votes;
        votedLink.voteStatus = voteStatus === 1 ? -1 : 1;
        store.writeQuery({ query: getNotificationAnswer, data });
      } catch (e) {}
    },
  });
};

export const _handleAnswerDislikePressed = (
  id,
  aid,
  totalLikes,
  totalDislikes,
  voteStatus
) => {
  client.mutate({
    mutation: unlikeAnswerMutation,
    variables: {
      question_id: id,
      answer_id: aid,
    },
    optimisticResponse: {
      __typename: "Mutation",
      dislikeAnswer: {
        __typename: "AnswerLikeVote",
        total_like_votes: totalLikes,
        total_unlike_votes: totalDislikes,
      },
    },

    update: (store, { data: { dislikeAnswer } }) => {
      try {
        const data = store.readQuery({
          query: getNotificationAnswer,
          variables: { ID: id },
        });

        const votedLink = data.question.answers.data.find(
          (data) => data.id === aid
        );

        votedLink.likes.paginatorInfo.total = dislikeAnswer.total_like_votes;
        votedLink.dislikes.paginatorInfo.total =
          dislikeAnswer.total_unlike_votes;
        votedLink.voteStatus = voteStatus === 0 ? -1 : 0;
        store.writeQuery({ query: getNotificationAnswer, data });
      } catch (e) {}
    },
  });
};

export const _handleFollowerPressed = (id) => {
  client.mutate({
    mutation: followUserMutation,
    variables: {
      user_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      followUser: {
        __typename: "FollowerResponse",
        message: "",
        status: null,
      },
    },
    update: (cache, { data: { followUser } }) => {
      try {
        const data = cache.readQuery({
          query: getUser,
          variables: { id: id },
        });

        data.user.is_follower = true;

        cache.writeQuery({ query: getUser, data });
      } catch (e) {}
    },
  });
};

export const _handleUnfollowerPressed = (id) => {
  client.mutate({
    mutation: unfollowUserMutation,
    variables: {
      user_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      unfollowUser: {
        __typename: "FollowerResponse",
        message: "",
        status: null,
      },
    },
    update: (cache, { data: { unfollowUser } }) => {
      try {
        const data = cache.readQuery({
          query: getUser,
          variables: { id: id },
        });

        data.user.is_follower = false;
        cache.writeQuery({ query: getUser, data });
      } catch (e) {}
    },
  });
};

/************************* Offer Like and Unlike ******************************/
export const _handleOfferLikePressed = (id) => {
  client.mutate({
    mutation: offerLikeMutation,
    variables: {
      offer_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      offerLike: {
        __typename: "OfferLike",
        id: id,
        isLiked: true,
        totalLikes: 0,
      },
    },

    update: (store, { data: { OfferLike } }) => {
      try {
        const data = store.readQuery({
          query: getOffer,
          variables: { id: parseInt(id) },
        });

        data.offer.isLiked = true;
        data.offer.totalLikes = offerLike.totalLikes;

        store.writeQuery({ query: getOffer, data });
      } catch (e) {}
    },
  });
};

export const _handleOfferUnLikePressed = (id) => {
  client.mutate({
    mutation: offerUnLikeMutation,
    variables: {
      offer_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      offerUnLike: {
        __typename: "OfferUnLike",
        id: id,
        isLiked: false,
        totalLikes: 0,
      },
    },

    update: (store, { data: { OfferUnLike } }) => {
      try {
        const data = store.readQuery({
          query: getOffer,
          variables: { id: parseInt(id) },
        });

        data.offer.isLiked = false;
        data.offer.totalLikes = OfferUnLike.totalLikes;

        store.writeQuery({ query: getOffer, data });
      } catch (e) {}
    },
  });
};

/************************* Offer save and Unsave bookmark ******************************/
export const _handleOfferSavePressed = (id) => {
  client.mutate({
    mutation: offerSaveBookmark,
    variables: {
      offer_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      offerSaveBookmark: {
        __typename: "OfferSaveBookmark",
        id: id,
        isBookmarked: true,
      },
    },

    update: (store, { data: { OfferSaveBookmark } }) => {
      try {
        const data = store.readQuery({
          query: getOffer,
          variables: { id: parseInt(id) },
        });

        data.offer.isBookmarked = true;

        store.writeQuery({ query: getOffer, data });
      } catch (e) {}
    },
  });
};

export const _handleOfferUnSavePressed = (id) => {
  client.mutate({
    mutation: offerUnSaveBookmark,
    variables: {
      offer_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      offerUnSaveBookmark: {
        __typename: "OfferUnSaveBookmark",
        id: id,
        isBookmarked: false,
      },
    },

    update: (store, { data: { OfferUnSaveBookmark } }) => {
      try {
        const data = store.readQuery({
          query: getOffer,
          variables: { id: parseInt(id) },
        });

        data.offer.isBookmarked = false;

        store.writeQuery({ query: getOffer, data });
      } catch (e) {}
    },
  });
};

/*************************** Offer Invite Request******************************/

export const _handleOfferInviteRequest = (id) => {
  client
    .mutate({
      mutation: offerInviteRequest,
      variables: {
        offer_id: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        offerInviteRequest: {
          __typename: "OfferInviteRequest",
          id: id,
          isRequestSent: true,
        },
      },

      update: (store, { data: { OfferInviteRequest } }) => {
        try {
          const data = store.readQuery({
            query: getOffer,
            variables: { id: parseInt(id) },
          });

          data.offer.isRequestSent = true;

          store.writeQuery({ query: getOffer, data });
        } catch (e) {}
      },
    })
    .then((results) => {
      Alert.alert(
        "Successfully Applied",
        "Your request has been sent successfully, Please wait for the approval and then able to submit your work.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    });
};

/****************************Offer watched*****************************/

export const _handleOfferWatched = (id) => {
  client.mutate({
    mutation: offerWatchedMutation,
    variables: {
      offer_id: id,
    },
    optimisticResponse: {
      __typename: "Mutation",
      offerWatched: {
        __typename: "OfferWatched",
        id: id,
        isWatched: true,
      },
    },

    update: (store, { data: { OfferWatched } }) => {
      try {
        const data = store.readQuery({
          query: getOffer,
          variables: { id: parseInt(id) },
        });

        data.offer.isWatched = true;

        store.writeQuery({ query: getOffer, data });
      } catch (e) {}
    },
  });
};

export const _handleofferUpdateStatus = (id, status) => {
  client.mutate({
    mutation: offerUpdateStatusMutation,
    variables: {
      offer_id: id,
      status: status,
    },
    optimisticResponse: {
      __typename: "Mutation",
      offerUpdateStatus: {
        __typename: "OfferUpdateStatus",
        id: id,
        visibility: false,
      },
    },

    update: (store, { data: { OfferUpdateStatus } }) => {
      try {
        const data = store.readQuery({
          query: getOffer,
          variables: { id: parseInt(id) },
        });

        data.offer.visibility = OfferUpdateStatus.visibility;

        store.writeQuery({ query: getOffer, data });
      } catch (e) {}
    },
  });
};
