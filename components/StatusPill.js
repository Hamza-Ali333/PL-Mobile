import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import questionStatusMutation from "../graphql/mutations/questionStatusMutation";
import getQuestions from "../graphql/queries/getQuestions";
import { Mutation } from "react-apollo";

class StatusPill extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    if (
      this.props.item.users.id === this.props.me.id &&
      this.props.item.status === 0
    ) {
      return (
        <View>
          <Mutation
            mutation={questionStatusMutation}
            update={(store, { data: { changeQuestionStatus } }) => {
              const data = store.readQuery({
                query: getQuestions,
              });

              const statusUpdate = data.questions.data.find(
                (data) => data.id === this.props.item.id
              );

              statusUpdate.status = this.props.item.status === 1 ? 0 : 1;
              store.writeQuery({ query: getQuestions, data });
            }}
          >
            {(changeQuestionStatus, { loading, error, data }) => (
              <TouchableOpacity
                onPress={() => {
                  changeQuestionStatus({
                    variables: {
                      question_id: this.props.item.id,
                      status: this.props.item.status === 1 ? 0 : 1,
                    },
                  });
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={color.primaryColor} />
                ) : (
                  <Text style={styles.pill}>
                    {this.props.item.status === 1 ? "Undo" : "Publish"}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </Mutation>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "#4fa2f4",
    color: "#ffffff",
    padding: 5,
    borderRadius: 5,
  },
});

export default StatusPill;
