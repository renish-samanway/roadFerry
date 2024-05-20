import {GET_WALLETDATA} from '../../actions/wallet/walletAction';

const initialState = {
  walletData: {
    balance: '0',
    transactions: [],
  },
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WALLETDATA:
      console.log('reducer: ', action?.data);
      return {
        ...state,
        // walletData: {
        //   balance: action?.data?.balance,
        //   transactions: action?.data?.transactions,
        // },
      };
    default:
      return state;
  }
};

export default walletReducer;
