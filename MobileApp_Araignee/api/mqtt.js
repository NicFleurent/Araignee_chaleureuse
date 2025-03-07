import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestMqtt = () => {
  const clientRef = useRef(null);

  function onConnect() {
    console.log("onConnect");
    clientRef.current.subscribe("spider_object")
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
  }
  9
  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });
 
    clientRef.current = new Paho.MQTT.Client("172.16.207.219", 9001, "uname");
 
    clientRef.current.onConnectionLost = onConnectionLost;
    clientRef.current.onMessageArrived = onMessageArrived;
    clientRef.current.connect({ onSuccess:onConnect, useSSL: false });
  }, []);

  const publishTest = ()=>{
    clientRef.current.publish("spider_app", "test",0,false)
  }

  return (
    <View style={styles.container}>
      <StandardButton
        label={t('settings.language_change')}
        color="green"
        onPress={publishTest} //() => openLanguageChangeAlert(language)
      />
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20
  },
  fullWidthContainer: {
    width: '100%',
    alignItems: 'center'
  },
  switchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  stayConnectedTxt: {
    marginRight: 20,
    fontSize: 16,
    fontWeight: '700'
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  linkContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  link: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  linkTxt: {
    color: '#84DCC6'
  }
}

export default TestMqtt