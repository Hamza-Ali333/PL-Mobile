import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { Ionicons, FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Chip, Button, Badge } from "react-native-paper";

class LeadboardFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true
    };
  }

  render() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",alignItems:  'center' 
        }}>
          <TouchableOpacity
            onPress={() => this.props.onActionSheetAction(0)}
            style={styles.chipFilters}>
              <Text style={{ color: color.blackColor,fontSize: 11,flex:1}}>
               {this.props.category_name
                ? this.props.category_name
                : "All"}
              </Text>
              <Image style={{width: 6,height: 6, resizeMode: 'contain' }}
                source={require('../assets/images/polygon-down.png')}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.onActionSheetAction(1)}
            style={styles.chipFilters}>
            <Text style={{ color: color.blackColor,fontSize: 11,flex:1}}>
              {this.props.year ? this.props.year : new Date().getFullYear()}
            </Text>
            <Image style={{width: 6,height: 6, resizeMode: 'contain' }}
                source={require('../assets/images/polygon-down.png')}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.onActionSheetAction(2)}
            style={styles.chipFilters}>
            <Text style={{ color: color.blackColor,fontSize: 11,flex:1}}>
              {this.props.month_name ? this.props.month_name : monthNames[new Date().getMonth()]}
            </Text>
            
            <Image style={{width: 6,height: 6, resizeMode: 'contain'}}
                source={require('../assets/images/polygon-down.png')}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.onActionSheetAction(3)}
            style={{justifyContent:'center', margin:10}}
            >

            
            <Image style={{ width:20, height:20, resizeMode: 'contain',alignItems: 'flex-end'}}
                source={require('../assets/images/filter-drag.png')}/>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chipFilters: {
    borderRadius: 6,
    marginRight: 2,
    backgroundColor: "#F3F5FB",
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between' ,
    alignItems: 'center',
    padding:10, 
    height: 35
  }
});

export default LeadboardFilter;
