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
    if (this.props.tags.length > 0) {
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
          key={'index-1'}
              onPress={this.props._clearFilters}
              style={{
                backgroundColor: color.lightGrayColor,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                margin:3
              }}
              >
                <Text style={{
                  color: color.primaryColor,
                  fontFamily: FontFamily.Medium,
                  fontSize: 13,
                }}>Clear</Text>
              </TouchableOpacity>
            {this.props.tags.map((cat, index) => (
              <TouchableWithoutFeedback
                key={index}
              >
                <Chip
                  style={{ backgroundColor: "#F0F2F6", marginRight: 4 }}
                  textStyle={{
                    color: "#9F9F9F",
                    fontFamily: FontFamily.Regular,
                  }}
                  onClose={()=>this.props._removeTags(cat)}
                >
                  {cat.tag_title}
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
