import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import CustomMarker from './components/CustomMarker';
import axios from 'axios';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [route, setRoute] = useState([]);


 

  const postData =() => {
    axios({
      method:'post',
      url:`http://127.0.0.1:8000/api/updateLocation`,
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
      data:{
        "userId":"1",
        "latitude":"17.98939",
        "longitude":"72.98347"
      }
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);
      setRoute((prevRoute) => [
        ...prevRoute,
        {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        },
      ]);

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          setRoute((prevRoute) => [
            ...prevRoute,
            {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            },
          ]);
        }
      );
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
    <Button title='Post Data' onPress={() => postData()} />
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"You are here"}>
            <CustomMarker />
          </Marker>
          <Polyline
            coordinates={route}
            strokeColor="#487ff7" // fallback for when strokeColors is not supported by the map-provider
            strokeColors={[
              '#7F0000',
              '#00000000', // no color, creates a "gradient" effect
              '#B24112',
              '#E5845C',
              '#238C23',
              '#7F0000',
            ]}
            strokeWidth={6}
          />
        </MapView>
      ) : (
        <Text>{text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:90,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});