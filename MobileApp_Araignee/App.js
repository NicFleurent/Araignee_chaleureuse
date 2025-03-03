import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import home from './pages/home';
import launchScan from './pages/launchScan';
import settings from './pages/settings';
import login from './pages/login';
import signup from './pages/signup';
import scan from './pages/scan';
import closeScan from './pages/closeScan';

export default function App() {
  const scanStack = createNativeStackNavigator({
    initialRouteName:"launchScan",
    screens:{
      launchScan: {
        screen: launchScan,
        options: {
          title: "Scan de la pièce",
        }
      },
      scan: {
        screen: scan,
        options: {
          title: "Scan",
        }
      },
      closeScan: {
        screen: closeScan,
        options: {
          title: "Scan terminé",
        }
      },
    }
  });
  const BottomTabs = createBottomTabNavigator({
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === "home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "scanStack") {
          iconName = focused ? "bug" : "bug-outline";
        }
        else{
          iconName = focused ? "cog" : "cog-outline";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "green",
      tabBarInactiveTintColor: "gray",
      tabBarShowLabel: false,
      tabBarActiveBackgroundColor: "black",
      tabBarInactiveBackgroundColor: "black",
      // tabBarInactiveBackgroundColor: "white",
      tabBarLabelPosition: "beside-icon",
      animation: "shift",
    }),
    screens: {
      home: {
        screen: home,
        options: {
          title: "Page d'accueil",
        }
      },
      scanStack: {
        screen: scanStack,
        options: {
          headerShown: false,
        }
      },
      settings: {
        screen: settings,
        options: {
          title: "Paramètres",
        }
      },
    },
  });

   const RootStack = createNativeStackNavigator({
    initialRouteName: "Menu",
    screenOptions: {
      headerStyle: {
         backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    screens: {
      Menu: {
        screen: BottomTabs,
        options: {
          headerShown: false,
        },
      },
      login: {
        screen: login,
        options: {
          title: "Connexion",
        }
      },
      signup: {
        screen: signup,
        options: {
          title: "Inscription",
        }
      },
    },
  });

  const Navigation = createStaticNavigation(RootStack);

  return (
    <Navigation/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
