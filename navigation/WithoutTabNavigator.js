import { Platform } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import ChatScreen from "../screens/ChatScreen";
const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const WithoutTabNavigator = createStackNavigator({
  Chat: { screen: ChatScreen }
});


export default WithoutTabNavigator;