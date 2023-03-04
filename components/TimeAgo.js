import React, { Component } from "react";
import { Text } from "react-native";
import moment, { locale } from "moment";

class TimeAgo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // dateAgo: moment(this.props.created_at).format("DD/MM/YYYY"),
      timeAgo: moment
        .utc(this.props.created_at, "YYYY-MM-DD hh:mm:ss")
        .local()
        .fromNow(),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        // dateAgo: moment(this.props.created_at).format("DD/MM/YYYY"),
        timeAgo: moment
          .utc(this.props.created_at, "YYYY-MM-DD hh:mm:ss")
          .local()
          .fromNow(),
      });
    }, 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render = () => {
    const { timeAgo, dateAgo } = this.state;
    return (
      <Text {...this.props}>
        {/* {timeAgo < "60 seconds ago"
          ? timeAgo
          : timeAgo < "60 minutes ago"
          ? timeAgo
          : timeAgo < "24 hours ago"
          ? timeAgo
          : timeAgo < "30 days ago"
          ? dateAgo
          : timeAgo < "12 months ago"
          ? dateAgo
          : dateAgo} */}
        {timeAgo}
      </Text>
    );
  };
}
export default TimeAgo;
