import {GET_TRANSPOTER_DATA, IS_TRANSPORTER_LOADING} from '../../../actions/customer/orderHistory/getTrasporterData';

const initialState = {
  transporterData: [],
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TRANSPOTER_DATA:
      return {
        transporterData: action.transporterData,
        isLoading: action.isLoading
      };
    case IS_TRANSPORTER_LOADING:
      return {
        isLoading: action.isLoading
      }
  }
  return state;
};
