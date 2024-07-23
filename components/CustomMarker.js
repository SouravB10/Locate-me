import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
export default function CustomMarker() {
    return (
        <View style={styles.markerContainer}>
            <Image
                source={require('../assets/Snapchat-1733322487.jpg')}
                style={styles.markerImage}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    markerImage: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        width: 30,
        height: 30,
        borderRadius: 50,
        borderColor: "red",
        borderWidth: 1.5,
        // backgroundColor: 'blue',
        overflow: 'hidden'
    }
});