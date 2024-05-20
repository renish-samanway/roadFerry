import {SET_ADDRESS_LIST} from '../../actions/addAddress/addressData';

const initialState = {
  allAddressData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ADDRESS_LIST:
      return {
        allAddressData: action.allAddressData,
      };
  }
  return state;
};
