import React from "react";
import {
  Dimensions,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text
} from "react-native";
import { Chip } from "react-native-paper";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";

const width = (Dimensions.get("window").width - 4 * 10) / 2;

class FindOfferFilterComponent extends React.Component {
  constructor(props) {
    super(props);
  }


  listTags = () => {
    if (this.props.categories.length > 0) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom:5,      
            marginLeft:5,      
            marginRight:5,      
          }}
        >
          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            horizontal={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
          >
          <TouchableOpacity
              onPress={this.props._clearFilters}
              style={{
                backgroundColor: '#F3F5FB',
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                margin:3
              }}
              >
                <Text style={{
                  color:  color.primaryColor,
                  fontFamily: FontFamily.Medium,
                  fontSize: 13,
                }}>Clear</Text>
              </TouchableOpacity>
            {this.props.categories.map((cat, index) => (
              <TouchableWithoutFeedback
                key={index}
              >
                <Chip
                  style={{ backgroundColor: "#F3F5FB", marginRight: 4,borderRadius: 10, }}
                  textStyle={{
                    color: "#9F9F9F",
                    fontFamily: FontFamily.Regular,
                  }}
                >
                  {cat.name}
                </Chip>
              </TouchableWithoutFeedback>
            ))}
            
          </ScrollView>
        </View>
      );
    } else {
      return null;
    }
  };


  render() {
    
    return this.listTags();
  }
}

export default FindOfferFilterComponent;
