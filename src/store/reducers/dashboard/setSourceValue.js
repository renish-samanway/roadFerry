import {SET_SOURCE_ADDRESS_VALUE} from '../../actions/dashboard/setSourceValue';

const initialState = {
  setSourceTextValue: '',
  setSourceLatitude: '',
  setSourceLongitude: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SOURCE_ADDRESS_VALUE:
      return {
        setSourceTextValue: action.setSourceTextValue,
        setSourceLatitude: action.setSourceLatitude,
        setSourceLongitude: action.setSourceLongitude,
      };
  }
  return state;
};
