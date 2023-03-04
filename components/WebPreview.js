import React from "react";
import PropTypes from "prop-types";
import {
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from "react-native";
import * as WebBrowser from "expo-web-browser";

const REGEX =
  /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;

export default class WebPreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUri: false,
      linkTitle: null,
      linkDesc: null,
      linkFavicon: null,
      linkImg: null,
    };
  }

  componentDidMount() {
    if (this.props.item.meta_text !== null) {
      this.getPreview(this.props.item.meta_text);
    } else {
      this.setState({ isUri: false });
    }
  }

  getPreview = (item) => {
    let data = item;

    // {title:"Announcing React Native 0.61 with Fast Refresh · React Native",
    // description:"We’re excited to announce React Native 0.61, which includes a new reloading experience we’re calling Fast Refresh.",
    // images:[],
    // favicons:["https://facebook.github.io/react-native/img/favicon.ico"]
    // }
    this.setState({
      isUri: true,
      linkTitle: data.title ? data.title : undefined,
      linkDesc: data.description ? data.description : undefined,
      linkImg:
        data.images && data.images.length > 0
          ? data.images.find(function (element) {
              return (
                element.includes(".png") ||
                element.includes(".jpg") ||
                element.includes(".jpeg")
              );
            })
          : undefined,
      linkFavicon:
        data.favicons && data.favicons.length > 0
          ? data.favicons[data.favicons.length - 1]
          : undefined,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.meta_text !== null) {
      this.getPreview(nextProps.item.meta_text);
    } else {
      this.setState({ isUri: false });
    }
  }

  _onLinkPressed = async () => {
    let meta = this.props.item.meta_text;
    await WebBrowser.openBrowserAsync(meta.url.match(REGEX)[0]);
  };

  renderImage = (
    imageLink,
    faviconLink,
    imageStyle,
    faviconStyle,
    imageProps
  ) => {
    return imageLink ? (
      <Image style={imageStyle} source={{ uri: imageLink }} {...imageProps} />
    ) : faviconLink ? (
      <Image
        style={faviconStyle}
        source={{ uri: faviconLink }}
        {...imageProps}
      />
    ) : null;
  };
  renderText = (
    showTitle,
    title,
    description,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines
  ) => {
    return (
      <View style={textContainerStyle}>
        {showTitle && (
          <Text numberOfLines={titleNumberOfLines} style={titleStyle}>
            {title}
          </Text>
        )}
        {description && (
          <Text
            numberOfLines={descriptionNumberOfLines}
            style={descriptionStyle}
          >
            {description}
          </Text>
        )}
      </View>
    );
  };
  renderLinkPreview = (
    text,
    containerStyle,
    imageLink,
    faviconLink,
    imageStyle,
    faviconStyle,
    showTitle,
    title,
    description,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines,
    imageProps
  ) => {
    return (
      <TouchableOpacity
        style={[styles.containerStyle, containerStyle]}
        activeOpacity={0.9}
        onPress={() => this._onLinkPressed()}
      >
        {this.renderImage(
          imageLink,
          faviconLink,
          imageStyle,
          faviconStyle,
          imageProps
        )}
        {this.renderText(
          showTitle,
          title,
          description,
          textContainerStyle,
          titleStyle,
          descriptionStyle,
          titleNumberOfLines,
          descriptionNumberOfLines
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const {
      text,
      containerStyle,
      imageStyle,
      faviconStyle,
      textContainerStyle,
      title,
      titleStyle,
      titleNumberOfLines,
      descriptionStyle,
      descriptionNumberOfLines,
      imageProps,
    } = this.props;
    return this.state.isUri
      ? this.renderLinkPreview(
          text,
          containerStyle,
          this.state.linkImg,
          this.state.linkFavicon,
          imageStyle,
          faviconStyle,
          title,
          this.state.linkTitle,
          this.state.linkDesc,
          textContainerStyle,
          titleStyle,
          descriptionStyle,
          titleNumberOfLines,
          descriptionNumberOfLines,
          imageProps
        )
      : null;
  }
}

const styles = {
  containerStyle: {
    flexDirection: "row",
  },
};

WebPreview.defaultProps = {
  text: null,
  containerStyle: {
    backgroundColor: "rgba(239, 239, 244,0.62)",
    alignItems: "center",
  },
  imageStyle: {
    width: Platform.isPad ? 160 : 110,
    height: Platform.isPad ? 160 : 110,
    paddingRight: 10,
    paddingLeft: 10,
  },
  faviconStyle: {
    width: 64,
    height: 64,
    paddingRight: 10,
    paddingLeft: 10,
  },
  textContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
  },
  title: true,
  titleStyle: {
    fontSize: 17,
    color: "#000",
    marginRight: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
    fontFamily: "Lato-Medium",
  },
  titleNumberOfLines: 2,
  descriptionStyle: {
    fontSize: 14,
    color: "#81848A",
    marginRight: 10,
    alignSelf: "flex-start",
    fontFamily: "Lato-Medium",
  },
  descriptionNumberOfLines: Platform.isPad ? 4 : 3,
  imageProps: { resizeMode: "contain" },
};

WebPreview.propTypes = {
  text: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  imageStyle: ViewPropTypes.style,
  faviconStyle: ViewPropTypes.style,
  textContainerStyle: ViewPropTypes.style,
  title: PropTypes.bool,
  titleStyle: Text.propTypes.style,
  titleNumberOfLines: Text.propTypes.numberOfLines,
  descriptionStyle: Text.propTypes.style,
  descriptionNumberOfLines: Text.propTypes.numberOfLines,
};
