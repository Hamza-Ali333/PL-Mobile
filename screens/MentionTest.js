import React from "react";
import { View, Keyboard, TouchableWithoutFeedback, StyleSheet, Image, Text } from "react-native";

import MentionInput from "react-native-mention";

const CELL_HEIGHT = 40
/**
 * Uniqueness for Object.
 */
const unique = (array) => {
  return [...new Set(array.map((s) => JSON.stringify(s)))].map((s) =>
    JSON.parse(s)
  );
};

/**
 * Dummy data set
 */
const users = [
  {
    id: 1,
    name: "spiderman",
    image:
      "https://vignette.wikia.nocookie.net/marvel-contestofchampions/images/a/a9/Spider-Man_%28Stark_Enhanced%29_portrait.png/revision/latest?cb=20170722100121",
  },
  {
    id: 3,
    name: "ironman",
    image:
      "https://mheroesgb.gcdn.netmarble.com/mheroesgb/DIST/Forum/hero_ironman01_S04.png",
  },
  {
    id: 4,
    name: "captain_america",
    image:
      "https://pbs.twimg.com/profile_images/685896589362216963/N2j7Rc9E_400x400.png",
  },
  {
    id: 5,
    name: "wolverine",
    image:
      "https://i.pinimg.com/474x/b3/b6/90/b3b6909a070bb5e7da45f30988646390--wolverine-movie-the-wolverine.jpg",
  },
  {
    id: 6,
    name: "blackwidow",
    image:
      "https://a.wattpad.com/useravatar/blackwidowisawesome.256.764312.jpg",
  },
  {
    id: 7,
    name: "batman",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhbPvo9yMCxs2Yzy6TD6ikA_PfFOLNN0ebrpuffqqHSHvCEWkx",
  },
];

class MentionTest extends React.Component {
  state = {
    inputText: "",
    isMentionBoxShown: false,
    isInputFieldActive: false,
    mentionSuggestions: [],
    allUniqueSuggestions: [], // suggestions shown in that instance. Eg first time suggestions shown are [1, 3, 4]
    // Second time shown are [2, 5, 6]. then `allUniquesSuggestions` -> [1, 2, 3, 4, 5, 6]
  };

  /**
   * InputText `onchangeText` callback
   */
  onChangeText = (text) => {
    this.setState({ inputText: text });
  };

  /**
   * Called by fake button that focuses or dismisses the text field.
   */
  toggleTextField = () => {
    this.setState(
      (prevState) => ({
        isInputFieldActive: !prevState.isInputFieldActive,
      }),
      () => {
        this.state.isInputFieldActive
          ? this.inputField.focus()
          : Keyboard.dismiss();
      }
    );
  };

  searchUser = (text) => {
    return users.filter((usr) => usr.name.search(text));
  };

  /**
   * Text field on change text event callback
   */
  mentioningChangeText = (text) => {
    const data = users;
    const suggestions = data.filter((user) =>
      user.name.toUpperCase().includes(text.toUpperCase())
    );
    // to remove space between name 'Shark James' -> 'SharkJames'
    const transformedSuggestions = suggestions.map((item) => ({
      ...item,
      name: item.name.replace(/\s/g, ""),
    }));
    const allSuggestions = [
      ...this.state.mentionSuggestions,
      ...transformedSuggestions,
    ];
    const allUniqueSuggestions = unique(allSuggestions);
    this.setState({
      mentionSuggestions: transformedSuggestions,
      allUniqueSuggestions,
    });
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <View style={styles.inputFieldContainer}>
            {/* Text Input Field */}
            <MentionInput
              reference={(comp) => {
                this.inputField = comp;
              }}
              placeholder="Post something of worth"
              onChangeText={this.onChangeText}
              mentionData={this.state.mentionSuggestions}
              mentioningChangeText={this.mentioningChangeText}
              renderMentionCell={({ item }) => {
                return (
                  <View style={styles.mainContainerCell}>
                    <View style={styles.imageContainer}>
                      <Image style={styles.image} source={item.image} />
                    </View>
                    <Text style={styles.text}>{item.name}</Text>
                  </View>
                );
              }}
              style={styles.inputField}
            />
            {/* Below button fakes the focusing of the input field */}
            <View style={{ flex: 1 }}>
              <TouchableWithoutFeedback
                style={styles.overlappingButton}
                onPress={this.toggleTextField}
              >
                <View style={styles.overlappingButton} />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainerCell: {
    flex: 1,
    marginVertical: 2,
    height: CELL_HEIGHT,
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 4,
    borderTopColor: "#EEEEEE",
    borderBottomColor: "#EEEEEE",
    alignItems: "center",
  },
  imageContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#F7F6FB",
  },
  text: {
    paddingHorizontal: 10,
  },
  mainContainer: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    padding: 8,
    marginTop: 80,
  },
  inputFieldContainer: {
    flex: 1,
    // backgroundColor: 'blue'
  },
  inputField: {
    // backgroundColor: 'red'
    // color: colors.transparent
  },
  overlappingButton: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  // Action Buttons
  actionButtonContainer: {
    justifyContent: "flex-end",
  },
  actionButton: {
    height: 44,
    flexDirection: "row",
    marginVertical: 2,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: 'grey',
  },
  actionButtonIcon: {
    tintColor: 'black',
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  inputMocText: {
    color: "yellow",
    paddingTop: 2,
    position: "absolute",
    zIndex: -1,
  },
  username: {
    color: 'green',
    fontWeight: "bold",
  },
  hashTag: {
    color: 'red',
    fontWeight: "bold",
  },
});

export default MentionTest;
