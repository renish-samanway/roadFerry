import {SET_FILTER_TRANSPOTER_LIST} from '../../actions/dashboard/filterTranspoterList';

const initialState = {
  allFilterData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER_TRANSPOTER_LIST:
      return {
        allFilterData: action.allFilterData,
      };
  }
  return state;
};
