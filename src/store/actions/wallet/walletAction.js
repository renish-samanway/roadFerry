import { getWalletDataByUserId } from "../../../helper/Utils/firestoreUtils";

export const GET_WALLETDATA = 'GET_WALLETDATA';

export const fetchWalletData = async (userId) => {
  return async (dispatch) => {
    let res = await getWalletDataByUserId(userId);
    // console.log("res: ", res);
      dispatch({
        type: GET_WALLETDATA,
        data: res,
      });
  }
};