import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

// Import the Plugins and Thirdparty library.

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AppConstants from '../../helper/constants/AppConstants';

// Import the JS file.

import Colors from '../../helper/extensions/Colors';

// Load the main class.

const GooglePlacesTextInput = (props) => {
  const {placeholder, soureValue, destinationValue} = props;
  return (
    <View>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        minLength={3}
        returnKeyType={'next'}
        listViewDisplayed="auto"
        fetchDetails={true}
        renderDescription={(row) => row.description}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          if (placeholder === 'Pickup Location') {
            soureValue(
              data.description,
              details.geometry.location.lat,
              details.geometry.location.lng,
            );
          } else {
            destinationValue(
              data.description,
              details.geometry.location.lat,
              details.geometry.location.lng,
            );
          }
          // console.log('Data is :', data);
          console.log('Details is :', details);
          // console.log('Location is :', details.geometry.location);
          console.log('Latitude is :', details.geometry.location.lat);
          console.log('Longitude is :', details.geometry.location.lng);
        }}
        // getDefaultValue={(data) => {
        //   if (placeholder === 'Source') {
        //     soureValue(data);
        //   } else {
        //     destinationValue(data);
        //   }
        // }}
        query={{
          key: AppConstants.google_place_api_key,
          language: 'en',
          // types: '(cities)',
        }}
        // currentLocation={true}
        // currentLocationLabel="Current location"
        enablePoweredByContainer={false}
        GooglePlacesDetailsQuery={{
          // fields: ['formatted_address', 'geometry'],
          fields: 'geometry',
        }}
        // setAddressText={(text) => soureValue(text)}
        styles={{
          textInputContainer: {
            marginLeft: 8,
            marginBottom: 8,
            // backgroundColor: Colors.subViewBGColor,
            height: 45,
            width: Dimensions.get('window').width - 64,
            borderRadius: 10,
          },
          textInput: {
            height: 45,
            color: Colors.textColor,
            fontSize: RFPercentage(2),
            // opacity: 0.6,
            // fontSize: 16,
            fontFamily: 'SofiaPro-Regular',
            // fontSize: RFPercentage(1.8),
            backgroundColor: Colors.subViewBGColor,
            borderRadius: 10,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />
    </View>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
});

export default GooglePlacesTextInput;
