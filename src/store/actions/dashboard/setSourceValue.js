export const SET_SOURCE_ADDRESS_VALUE = 'SET_SOURCE_ADDRESS_VALUE';

export const setSourceAddressValue = (textValue, latitude, longitude) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      var sourceTextValue = textValue;
      var sourceLatitude = latitude;
      var sourceLongitude = longitude;

      dispatch({
        type: SET_SOURCE_ADDRESS_VALUE,
        setSourceTextValue: sourceTextValue,
        setSourceLatitude: sourceLatitude,
        setSourceLongitude: sourceLongitude,
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
