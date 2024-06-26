export const SET_COMPLAIN_VALUE = 'SET_COMPLAIN_VALUE';

export const setComplainValueText = (
  strPickupFirstName,
  strPickupLastName,
  strPickupEmail,
  strPickupPhone,
  strPickupStreet,
  strPickupApartment,
  strPickupCity,
  strPickupState,
  strPickupCountry,
  strPickupZipCode,
  strPickupSending,
  strPickupWeight,
  strPickupDateTime,
  strPickupParcelValue,
  strPickupWidth,
  strPickupHeight,
  strPickupComment,
) => {
  return {
    type: SET_COMPLAIN_VALUE,
    setPickupFirstName: strPickupFirstName,
    setPickupLastName: strPickupLastName,
    setPickupEmail: strPickupEmail,
    setPickupPhone: strPickupPhone,
    setPickupStreet: strPickupStreet,
    setPickupApartment: strPickupApartment,
    setPickupCity: strPickupCity,
    setPickupState: strPickupState,
    setPickupCountry: strPickupCountry,
    setPickupZipCode: strPickupZipCode,
    setPickupSending: strPickupSending,
    setPickupWeight: strPickupWeight,
    setPickupDateTime: strPickupDateTime,
    setPickupParcelValue: strPickupParcelValue,
    setPickupWidth: strPickupWidth,
    setPickupHeight: strPickupHeight,
    setPickupComment: strPickupComment,
  };
};
