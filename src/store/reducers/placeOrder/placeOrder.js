import {SET_PLACE_ORDER} from '../../actions/placeOrder/placeOrder';

const initialState = {
  setPickupFirstName: '',
  setPickupLastName: '',
  setPickupEmail: '',
  setPickupPhone: '',
  setPickupStreet: '',
  setPickupApartment: '',
  setPickupCity: '',
  setPickupState: '',
  setPickupCountry: '',
  setPickupZipCode: '',
  setPickupSending: '',
  setPickupWeight: '',
  setPickupDateTime: '',
  setPickupParcelValue: '',
  setPickupWidth: '',
  setPickupHeight: '',
  setPickupComment: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACE_ORDER:
      return {
        setPickupFirstName: action.setPickupFirstName,
        setPickupLastName: action.setPickupLastName,
        setPickupEmail: action.setPickupEmail,
        setPickupPhone: action.setPickupPhone,
        setPickupStreet: action.setPickupStreet,
        setPickupApartment: action.setPickupApartment,
        setPickupCity: action.setPickupCity,
        setPickupState: action.setPickupState,
        setPickupCountry: action.setPickupCountry,
        setPickupZipCode: action.setPickupZipCode,
        setPickupSending: action.setPickupSending,
        setPickupWeight: action.setPickupWeight,
        setPickupDateTime: action.setPickupDateTime,
        setPickupParcelValue: action.setPickupParcelValue,
        setPickupWidth: action.setPickupWidth,
        setPickupHeight: action.setPickupHeight,
        setPickupComment: action.setPickupComment,
      };
  }
  return state;
};
