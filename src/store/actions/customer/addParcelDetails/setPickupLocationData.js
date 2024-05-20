import PickupLocationData from '../../../../helper/models/addParcelDetails/PickupLocationData';

export const SET_PICKUP_LOCATION_DATA = 'SET_PICKUP_LOCATION_DATA';

export const setPickupLocationData = (
  firstName,
  lastName,
  email,
  phone,
  flatName,
  area,
  city,
  state,
  country,
  pincode,
  sending,
  parcelValue,
  weight,
  dimensions,
  width,
  height,
  pickupDateTime,
  comment,
) => {
  return async (dispatch) => {
    // any async code you want!
    //   if (status === 'pickup') {
    console.log('ENTER');
    const loadedPickupLocationData = new PickupLocationData(
      firstName,
      lastName,
      email,
      phone,
      flatName,
      area,
      city,
      state,
      country,
      pincode,
      sending,
      parcelValue,
      weight,
      dimensions,
      width,
      height,
      pickupDateTime,
      comment,
    );
    console.log('CLOSE');
    console.log('Pickup Location Data is : ', loadedPickupLocationData);

    dispatch({
      type: SET_PICKUP_LOCATION_DATA,
      pickupLocationData: loadedPickupLocationData,
    });
  };
};
