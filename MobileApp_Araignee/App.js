import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import home from './pages/home';
import launchScan from './pages/launchScan';
import settings from './pages/settings';
import login from './pages/login';
import signup from './pages/signup';
import scan from './pages/scan';
import closeScan from './pages/closeScan';
import { faGear, faRobot, faTemperatureLow } from '@fortawesome/free-solid-svg-icons';
import "./i18n.js";
import { useTranslation } from 'react-i18next';
import { Provider, useSelector } from 'react-redux';
import store from "./stores/store.js"
import addUpdateTempPrefs from './pages/tempPrefs/addUpdateTempPrefs.js';

export default function App() {
  const {t} = useTranslation();

  const scanStack = createNativeStackNavigator({
    initialRouteName:"launchScan",
    screenOptions: {
      headerShadowVisible:false,
      headerTitleStyle: {
        fontSize: 24,
        fontWeight: "bold"
      },
    },
    screens:{
      launchScan: {
        screen: launchScan,
        options: {
          title: t('launchScan.title'),
        }
      },
      scan: {
        screen: scan,
        options: {
          title: t('scan.title'),
        }
      },
      closeScan: {
        screen: closeScan,
        options: {
          title: t('closeScan.title'),
        }
      },
    }
  });

  const BottomTabs = createBottomTabNavigator({
    initialRouteName: "home",
    screenOptions: ({ route }) => {
      const darkMode = useSelector((state) => state.parameters.darkmode); 
      return {
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "home") {
            iconName = faTemperatureLow;
          } else if (route.name === "scanStack") {
            iconName = faRobot;
          } else {
            iconName = faGear;
          }
          return (
            <View style={focused && { backgroundColor: 'lightgray', padding: 10, borderRadius: 230 }}>
              <FontAwesomeIcon icon={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: darkMode ? "#15202B" : "#4B4E6D",
        tabBarInactiveTintColor: darkMode ? "#A9A9A9" : "lightgray",
        tabBarShowLabel: false,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: darkMode ? "#15202B" : "#FFFFFF",
        },
        headerShadowVisible: false,
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={{ foreground: false }} />
        ),
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: "bold"
        },
      };
    },
    screens: {
      home: {
        screen: home,
        options: {
          title: t('home.title')
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
          title: t('settings.title'),
        }
      },
    },
  });

   const RootStack = createNativeStackNavigator({
    initialRouteName: "login",
    screenOptions: {
      headerShadowVisible:false,
      headerTitleStyle:{
        fontSize:24,
        fontWeight: "bold"
      }
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
          title: t('auth.connexion'),
          headerBackVisible:false
        }
      },
      signup: {
        screen: signup,
        options: {
          title: t('auth.signup'),
          headerBackVisible:false
        }
      },
      addUpdateTempPrefs:{
        screen:addUpdateTempPrefs,
        options: {
          title: t('addUpdate.title')
        }
      }
    },
  });

  const Navigation = createStaticNavigation(RootStack);

  return (
    <Provider store={store}>
        <Navigation />
        <StatusBar style="auto" />
    </Provider>
  );
}
