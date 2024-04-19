import {IS_TRANSPORTER_LOADING, SET_FILTER_TRANSPOTER_LIST} from '../../actions/dashboard/filterTranspoterList';

const initialState = {
  allFilterData: [],
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER_TRANSPOTER_LIST:
      return {
        allFilterData: action.allFilterData,
        isLoading: action.isLoading
      };
    case IS_TRANSPORTER_LOADING:
      return {
        isLoading: action.isLoading
      }
  }
  return state;
};
