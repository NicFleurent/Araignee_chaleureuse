import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import home from './pages/home';
import launchScan from './pages/launchScan';
import settings from './pages/settings';
import login from './pages/login';
import signup from './pages/signup';
import scan from './pages/scan';
import closeScan from './pages/closeScan';
import { db } from './api/firebase';
import { useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { faGear, faRobot, faTemperatureLow } from '@fortawesome/free-solid-svg-icons';
import "./i18n.js";
import { useTranslation } from 'react-i18next';

export default function App() {
  const {t, i18n} = useTranslation();

  // useEffect(()=>{
  //   const getPrefs = async () => {
  //     const docRef = doc(db, "comfort_preferences","2DXgYow1rPELwUrwnM33");
  //     const docSnap = await getDoc(docRef)
  //     console.log(docSnap.data())
  //   }
  //   getPrefs();
  // },[])

  // useEffect(()=>{
  //   const getPrefs = async () => {
  //     const querySnapshot = await getDocs(collection(db, "comfort_preferences"));
  //     querySnapshot.forEach((doc) => {
  //       console.log(`${doc.id} => ${doc.data()}`);
  //       console.log(doc.data())
  //     });
  //   }
  //   getPrefs();
  // },[])

  const scanStack = createNativeStackNavigator({
    initialRouteName:"launchScan",
    screenOptions: {
      headerShadowVisible:false
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
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === "home") {
          iconName = faTemperatureLow;
        } else if (route.name === "scanStack") {
          iconName = faRobot;
        }
        else{
          iconName = faGear;
        }
        return (
          <View style={focused && {backgroundColor:'lightgray', padding:10, borderRadius:230}}>
            <FontAwesomeIcon icon={iconName} size={size} color={color} />
          </View>
        );
      },
      tabBarActiveTintColor: "#4B4E6D",
      tabBarInactiveTintColor: "lightgray",
      tabBarShowLabel: false,
      tabBarLabelPosition: "beside-icon",
      tabBarStyle: {
        borderTopWidth: 0,
        elevation:0
      },
      headerShadowVisible:false,
      tabBarButton: (props) => (
        <Pressable {...props} android_ripple={{foreground: false }} />
      ),
    }),
    screens: {
      home: {
        screen: home,
        options: {
          title: t('home.title'),
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
        fontSize:28
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
    },
  });

  const Navigation = createStaticNavigation(RootStack);

  return (
    <Navigation/>
  );
}
