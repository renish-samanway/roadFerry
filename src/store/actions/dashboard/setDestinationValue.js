export const SET_DESTINATION_ADDRESS_VALUE = 'SET_DESTINATION_ADDRESS_VALUE';

export const setDestinationAddressValue = (textValue, latitude, longitude, allDetails) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      var destinationValue = textValue;
      var destinationLatitude = latitude;
      var destinationLongitude = longitude;

      dispatch({
        type: SET_DESTINATION_ADDRESS_VALUE,
        setDestinationTextValue: destinationValue,
        setDestinationLatitude: destinationLatitude,
        setDestinationLongitude: destinationLongitude,
        destinationAllData: allDetails
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
