import {SAVE_NOTIFICATION_DATA} from '../../actions/dashboard/saveNotificationData';

const initialState = {
  notificationData: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_NOTIFICATION_DATA:
      return {
        notificationData: action.notificationData
      };
  }
  return state;
};
