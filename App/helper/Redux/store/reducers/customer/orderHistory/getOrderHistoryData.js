import {GET_ORDER_HISTORY_DATA, LOADING_ORDER_HISTORY_DATA} from '../../../actions/customer/orderHistory/getOrderHistoryData';

const initialState = {
  customerPendingOrderData: [],
  customerOngoingOrderData: [],
  customerCompletedOrderData: [],
  customerRejectedOrderData: [],
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_ORDER_HISTORY_DATA:
      return {
        ...state,
        isLoading: action.isLoading
      };
    case GET_ORDER_HISTORY_DATA:
      return {
        customerPendingOrderData: action.customerPendingOrderData,
        customerOngoingOrderData: action.customerOngoingOrderData,
        customerCompletedOrderData: action.customerCompletedOrderData,
        customerRejectedOrderData: action.customerRejectedOrderData,
        isLoading: false
      };
    default:
      return state
  }
};
