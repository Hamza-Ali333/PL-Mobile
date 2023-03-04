import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';

import TabBarIcon from '../components/TabBarIcon';
import AuthScreen from '../screens/AuthScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const AuthNavigator = createStackNavigator(
  {
    Login: {
      screen:AuthScreen,
    },
    SignUp: {
      screen:SignUpScreen,
      navigationOptions: {
        headerMode: 'none',  // doesn't work
        header: null, // only this works
      }
    },
    SignIn: {
      screen:SignInScreen,
      navigationOptions: {
        headerMode: 'none',  // doesn't work
        header: null, // only this works
      }
    },
    ForgetPassword: {
      screen:ForgetPasswordScreen,
    },
    ResetPassword: {
      screen:ResetPasswordScreen,
    }
    
  }
);

export default AuthNavigator;
