import { GET_ORDER_HISTORY_DATA, IS_DASHBOARD_LOADING, IS_DRIVER_DASHBOARD_LOADING, SET_IS_DRIVER_DETAILS_LOADING } from '../../../actions/customer/orderHistory/getOrderHistoryData';

const initialState = {
  customerPendingOrderData: [],
  customerOngoingOrderData: [],
  customerRejectedOrderData: [],
  customerAssignedOrderData: [],
  customerCompletedOrderData: [],
  isLoading: false,
  isDriverLoading: false,
  isDetailLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER_HISTORY_DATA:
      return {
        customerPendingOrderData: action.customerPendingOrderData,
        customerOngoingOrderData: action.customerOngoingOrderData,
        customerRejectedOrderData: action.customerRejectedOrderData,
        customerAssignedOrderData: action.customerAssignedOrderData,
        customerCompletedOrderData: action.customerCompletedOrderData,
        isLoading: action.isLoading,
        isDriverLoading: action.isDriverLoading,
        isDetailLoading: false
      };
    case SET_IS_DRIVER_DETAILS_LOADING:
      return {
        isDetailLoading: true
      }
    case IS_DASHBOARD_LOADING:
      return {
        isLoading: action.isLoading
      }
    case IS_DRIVER_DASHBOARD_LOADING:
      return {
        isDriverLoading: action.isDriverLoading
      }
  }
  return state;
};
