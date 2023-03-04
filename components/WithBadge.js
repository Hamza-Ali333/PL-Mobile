import React from "react";
import { Badge } from "react-native-paper";
import { Query } from "react-apollo";
import getTotalMessage from "../graphql/queries/getTotalMessage";

class WithBadge extends React.Component {
  constructor(props) {
    super(props);
    this.refetch;
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  tapOnTabNavigator = () => {
    if (typeof this.refetch === "function") {
      try {
        this.refetch();
      } catch (err) {}
    }
  };

  componentDidUpdate() {
    // }
  }
  render() {
    return (
      <Query query={getTotalMessage}>
        {({ loading, error, data, fetchMore, refetch }) => {
          this.refetch = refetch;
          if (!data) {
            return null;
          }

          if (data.me != null && data.me.getTotalMessage > 0) {
            return (
              <Badge
                size={20}
                style={{
                  ...{ top: 2, right: 2, backgroundColor: "#FF4141" },
                  ...this.props.style,
                }}
              >
                {data.me.getTotalMessage}
              </Badge>
            );
          } else {
            return null;
          }
        }}
      </Query>
    );
  }
}

export default WithBadge;
