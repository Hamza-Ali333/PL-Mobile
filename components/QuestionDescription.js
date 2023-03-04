import React from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Chip } from "react-native-paper";
import WebPreview from "../components/WebPreview";
import htmlToNative from "../helper/htmlHelper";
import ReadMore from "react-native-read-more-text";

class QuestionDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: false,
      scrollEnabled: true,
    };
  }

  _renderTruncatedFooter = () => {
    return (
      <Text
        style={{ color: color.primaryColor, marginTop: 5 }}
        onPress={
          this.props.navigateDetailPro ? this.props.navigateDetailPro : null
        }
      >
        Read more
      </Text>
    );
  };

  // _renderRevealedFooter = (handlePress) => {
  //   return (
  //     <Text
  //       style={{ color: color.primaryColor, marginTop: 5 }}
  //       onPress={handlePress}
  //     >
  //       Show less
  //     </Text>
  //   );
  // };

  componentDidUpdate() {}

  _filterTag = (id, title) => {
    if (typeof this.props.navigation.state.params.filterTag !== "undefined") {
      this.props.navigation.state.params.filterTag(id, title);
      if (this.props.navigation.state.params.isBack) {
        this.props.navigation.goBack();
      }
    }
  };
  onContentSizeChange = (contentWidth, contentHeight) => {
    // Save the content height in state
    if (contentWidth > Dimensions.get("window").width) {
      //this.setState({hasMore:true})
    } else {
      //this.setState({hasMore:false})
    }
  };

  moreTagPress = () => {
    //this.setState({hasMore:false,scrollEnabled:true})
    //this.scrollView.scrollToEnd({ animated: true });
  };

  navigateProfile = (str) => {
    const ids = str.split("-");
    this.props.navigation.navigate("UserProfile", {
      user_id: ids[1],
    });
  };

  navigateToProfile = (id) => {
    this.props.navigation.navigate("UserProfile", {
      user_id: id,
    });
  };

  formatMentionNode = (txt, key) => {
    return (
      <Text
        onPress={this.navigateProfile.bind(this, key)}
        key={key}
        style={styles.mention}
      >
        {txt}
      </Text>
    );
  };

  listCategories = () => {
    if (this.props.item.tags.length > 0 && this.props.isTag !== true) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            position: "relative",
            marginBottom: 10,
          }}
        >
          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            horizontal={true}
            scrollEnabled={this.state.scrollEnabled}
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={this.onContentSizeChange}
          >
            {this.props.item.tags.map((cat, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={this._filterTag.bind(this, cat.id, cat.tag_title)}
              >
                <Chip
                  style={{
                    backgroundColor: "#F3F5FB",
                    marginRight: 4,
                    borderRadius: 10,
                  }}
                  textStyle={{
                    color:
                      this.props.tag === cat.id
                        ? color.primaryColor
                        : color.grayColor,
                    fontFamily: FontFamily.Regular,
                  }}
                >
                  {cat.tag_title}
                </Chip>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
          {/*this.state.hasMore &&
           <TouchableOpacity onPress={this.moreTagPress} style={styles.moreTags}>
             <Text style={styles.moreTagsText}>more</Text>
             </TouchableOpacity>
          */}
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <View>
        {this.listCategories()}
        {this.props.item.description !== "App" &&
          this.props.item.description !== null && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={
                this.props.navigateDetailPro
                  ? this.props.navigateDetailPro
                  : null
              }
            >
              {this.props.hideText ? (
                <ReadMore
                  numberOfLines={3}
                  renderTruncatedFooter={this._renderTruncatedFooter}
                  // renderRevealedFooter={this._renderRevealedFooter}
                  // onReady={this._handleTextReady}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      marginBottom: 13,
                      fontFamily: FontFamily.Bold,
                    }}
                  >
                    {this.props.item.description}
                  </Text>
                </ReadMore>
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 13,
                    fontFamily: FontFamily.Bold,
                  }}
                >
                  {this.props.item.description}
                </Text>
              )}
            </TouchableOpacity>
          )}
        {typeof this.props.enableQuestion === "undefined" ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={
              this.props.navigateDetailPro ? this.props.navigateDetailPro : null
            }
          >
            <Text style={{ marginBottom: 13, fontFamily: FontFamily.Regular }}>
              {htmlToNative(this.props.item.question, this.navigateToProfile)}
            </Text>
          </TouchableOpacity>
        ) : (
          (this.props.item.description === "App" ||
            this.props.item.description === null) && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={
                this.props.navigateDetailPro
                  ? this.props.navigateDetailPro
                  : null
              }
            >
              <Text
                style={{ marginBottom: 13, fontFamily: FontFamily.Regular }}
              >
                {htmlToNative(this.props.item.question, this.navigateToProfile)}
              </Text>
            </TouchableOpacity>
          )
        )}
        <WebPreview
          {...this.props}
          text={this.props.item.question}
          item={this.props.item}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  moreTagsText: {
    textAlign: "center",
    color: "#A9A9A9",
    fontFamily: FontFamily.Bold,
    fontSize: 12,
  },
  moreTags: {
    width: 80,
    borderRadius: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 1)",
    position: "absolute",
    right: 0,
    top: 2,
  },
  mention: {
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: "rgba(36, 77, 201, 0.05)",
    color: color.primaryColor,
  },
});

export default QuestionDescription;
