export const SAVE_NOTIFICATION_DATA = 'SAVE_NOTIFICATION_DATA';

export const saveNotificationData = (notificationData) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      dispatch({
        type: SAVE_NOTIFICATION_DATA,
        notificationData: notificationData
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
