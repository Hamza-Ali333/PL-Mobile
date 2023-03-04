import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import { FontAwesome, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getCourseCategories from "../../graphql/queries/getCourseCategories";
import { Query } from "react-apollo";
import CourseCategoryAccordian from "../../components/CourseCategoryAccordian";
import getClasses from "../../graphql/queries/getClasses";
const windowWidth = Dimensions.get("window").width;
import capitalize from "../../helper/capitalize";

class ClassSearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myCategories: [],
      search: "",
      selectedCategories: [],
      categories: [],
    };
  }

  // selectCategories = (category) => {
  //   const { selectedCategories } = this.state;

  //   var n = selectedCategories.includes(category);
  //   if (n === true) {
  //     var array = [...selectedCategories]; // make a separate copy of the array
  //     var index = array.indexOf(category);
  //     if (index !== -1) {
  //       array.splice(index, 1);
  //       this.setState({ selectedCategories: array });
  //     }
  //   } else {
  //     var joined = this.state.selectedCategories.concat(category);
  //     this.setState({ selectedCategories: joined }, () => {});
  //   }
  // };

  _onCategoryChange = (category) => {
    const { selectedCategories } = this.state;

    if (selectedCategories.length > 0) {
      var temp = [];
      if (category[1]) {
        temp.push(category[1]);

        var n = selectedCategories.includes(category[1]);
        if (n === true) {
          var array = [...selectedCategories]; // make a separate copy of the array
          var index = array.indexOf(category[1]);
          if (index !== -1) {
            array.splice(index, 1);
            this.setState({ selectedCategories: array });
          }
        } else {
          var joined = this.state.selectedCategories.concat(temp);
          this.setState({ selectedCategories: joined }, () => {});
        }
      }
    } else {
      var joined = this.state.selectedCategories.concat(category);
      this.setState({ selectedCategories: joined }, () => {});
    }
  };

  renderCategoryItem = ({ item, index }) => {
    return (
      <CourseCategoryAccordian
        categories={this.state.selectedCategories}
        key={index}
        item={item}
        onCategoryChange={this._onCategoryChange}
      />
    );
  };

  renderCategories = () => {
    let variables = {};
    return (
      <Query query={getCourseCategories} variables={variables}>
        {({ loading, error, data, fetchMore, refetch }) => {
          this.refetch2 = refetch;
          if (loading)
            return (
              <View>
                <ActivityIndicator size="small" color={color.primaryColor} />
              </View>
            );
          if (error)
            return (
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 19 }}>No Internet Connection</Text>
                  <Text>Could not connected to the network </Text>
                  <Text>Please check and try again.</Text>
                  <Button title="Retry" onPress={() => refetch2()} />
                </View>
              </View>
            );
          if (data !== undefined) {
            return (
              <FlatList
                // horizontal
                data={data.course_categories}
                renderItem={this.renderCategoryItem}
                keyExtractor={(item) => item.id}
              />
            );
          }
        }}
      </Query>
    );
  };

  onChangeSearch = (text) => {
    this.setState({ search: text });
  };

  renderItem = ({ item, index }) => {
    let imageUrl;
    if (item.course_cover_pic === undefined) {
      imageUrl = "https://procurementleague.com/images/showcase-img-4.png";
    } else {
      imageUrl = item.course_cover_pic;
    }

    let rating = item.course_feedback_avg;
    let stars = [];
    for (var i = 1; i <= 5; i++) {
      let name = "";
      if (i < rating) {
        name = "star";
      } else if (i > rating && rating > i - 1) {
        name = "star-half-empty";
      } else if (i > rating) {
        name = "star-o";
      }
      stars.push(
        <FontAwesome
          style={styles.stars}
          name={name}
          size={16}
          color="#eb8a2f"
        />
      );
    }

    return (
      <>
        <TouchableOpacity
          style={styles.list}
          onPress={() =>
            this.props.navigation.navigate("ClassDetail", { item: item })
          }
        >
          <Image
            style={{
              width: 62,
              height: 62,
              resizeMode: "cover",
              borderRadius: 6,
            }}
            source={{ uri: imageUrl }}
          />
          <View style={styles.listBody}>
            <Text style={[styles.title, { flex: 1 }]} numberOfLines={1}>
              {item.course_name}
            </Text>
            <View style={styles.authors}>
              {item.users.data.map((n, index) => (
                <TouchableOpacity key={index}>
                  <Text style={styles.primaryText}>
                    {index == item.users.data.length - 1 ? (
                      <Text style={styles.primaryText} numberOfLines={1}>
                        {capitalize(n.firstname)} {capitalize(n.lastname)}
                      </Text>
                    ) : (
                      <Text style={styles.primaryText} numberOfLines={1}>
                        {capitalize(n.firstname)} {capitalize(n.lastname)},{" "}
                      </Text>
                    )}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.rating}>
              {stars}
              <Text style={styles.grayText}>
                ({item.course_feedback_count})
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
      </>
    );
  };
  renderEmptyContainer = () => {
    return (
      <View style={{ alignSelf: "center", marginTop: 13 }}>
        <Text
          style={{
            fontFamily: FontFamily.Medium,
            // color: color.grayColor,
            fontSize: 14,
          }}
        >
          No Classes Found
        </Text>
      </View>
    );
  };

  renderClassesList = () => {
    let variables = {};

    if (this.state.search !== "") {
      variables.search = this.state.search;
    }
    return (
      <Query query={getClasses} variables={variables}>
        {({ loading, error, data, fetchMore, refetch }) => {
          //   this.refetch.push(refetch);
          if (loading)
            return (
              <View>
                <ActivityIndicator size="small" color={color.primaryColor} />
              </View>
            );
          if (error)
            return (
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 19 }}>No Internet Connection</Text>
                  <Text>Could not connected to the network </Text>
                  <Text>Please check and try again.</Text>
                  <Button title="Retry" onPress={() => this.refetch1()} />
                </View>
              </View>
            );
          if (data !== undefined) {
            if (data.courses.data.length > 0) {
              return (
                <FlatList
                  data={data.courses.data}
                  renderItem={this.renderItem}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                />
              );
            } else {
              return (
                <View style={{ alignSelf: "center" }}>
                  <Text
                    style={{
                      fontFamily: FontFamily.Medium,
                      color: color.grayColor,
                      fontSize: 14,
                    }}
                  >
                    No Classes Found
                  </Text>
                </View>
              );
            }
          }
        }}
      </Query>
    );
  };

  render() {
    console.log("this.state.selectedCategories", this.state.selectedCategories);
    return (
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={styles.container}>
          <View style={styles.roundedTextInput}>
            <Feather name="search" size={24} color={color.grayColor} />
            <TextInput
              style={styles.textInput}
              placeholder="Type free text to search for any class"
              onChangeText={(text) => this.onChangeSearch(text)}
            />
          </View>

          {this.state.search === "" ? (
            <>
              {this.state.selectedCategories.reverse().map((c) => (
                <>
                  {c.id !== undefined ? (
                    <Query
                      query={getClasses}
                      variables={{ categories: [c.id] }}
                    >
                      {({ loading, error, data, fetchMore, refetch }) => {
                        this.refetch3 = refetch;
                        if (loading)
                          return (
                            <View>
                              <ActivityIndicator
                                size="small"
                                color={color.primaryColor}
                              />
                            </View>
                          );
                        if (error)
                          return (
                            <View
                              style={{
                                alignItems: "center",
                                flex: 1,
                                flexDirection: "column",
                              }}
                            >
                              <View
                                style={{
                                  alignItems: "center",
                                }}
                              >
                                <Text style={{ fontSize: 19 }}>
                                  No Internet Connection
                                </Text>
                                <Text>Could not connected to the network </Text>
                                <Text>Please check and try again.</Text>
                                <Button
                                  title="Retry"
                                  onPress={() => this.refetch3()}
                                />
                              </View>
                            </View>
                          );
                        if (data !== undefined) {
                          return (
                            <>
                              {data.courses.data.length > 0 ? (
                                <View
                                  style={[
                                    styles.titleList,
                                    {
                                      marginHorizontal: -10,
                                      marginBottom: 13,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.text,
                                      { fontFamily: FontFamily.Medium },
                                    ]}
                                  >
                                    {c.name}
                                  </Text>
                                </View>
                              ) : null}
                              <FlatList
                                horizontal
                                data={data.courses.data}
                                renderItem={this.renderItem}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                // ListEmptyComponent={this.renderEmptyContainer()}
                              />
                            </>
                          );
                        }
                      }}
                    </Query>
                  ) : null}
                </>
              ))}
              <Text style={[styles.heading]}>
                Search for a class by browsing skills
              </Text>
              <View style={{ flex: 1 }}>{this.renderCategories()}</View>
            </>
          ) : (
            <View>
              <Text style={[styles.heading, { marginBottom: 20 }]}>
                Results
              </Text>
              {this.renderClassesList()}
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

ClassSearchScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: () => <Text style={styles.headerPageTitle}>Search Classes</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 13,
  },
  heading: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 18,
  },
  goProMsg: {
    flexDirection: "row",
    backgroundColor: color.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 13,
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  goProMsgText: {
    fontSize: 16,
    color: "white",
    flex: 1,
  },
  authors: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  roundedTextInput: {
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  listBody: {
    marginLeft: 10,
    flex: 1,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  list: {
    flex: 1,
    width: windowWidth - 30,
    flexDirection: "row",
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
  },
  titleList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
  },
  text: {
    color: color.blackColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  primaryText: {
    color: color.primaryColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  chip: {
    backgroundColor: "#F3F5FB",
    marginRight: 8,
    marginTop: 8,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    height: 34,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  stars: {
    marginRight: 3,
  },
  grayText: {
    color: color.grayColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  separator: {
    height: 1,
    backgroundColor: color.lightGrayColor,
    marginVertical: 13,
  },
});

export default ClassSearchScreen;
