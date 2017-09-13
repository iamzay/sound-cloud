import * as types from '../constants/actionTypes.js';

const initialState = {
  songs: {},
  users: {}
};

function entities(state = initialState, action) {
  const tmp = { songs: { ...state.songs }, users: { ...state.users } };
  switch (action.type) {
    case types.RECEIVE_SONGS:
      return {
        songs: { ...state.songs, ...action.entities.songs },
        users: { ...state.users, ...action.entities.users }
      };
    case types.RECEIVE_COMMENTS:
      tmp.songs[action.songId].comments = action.comments;
      return tmp;
    case types.RECEIVE_USER:
      return {
        songs: { ...state.songs },
        users: { ...state.users, [action.userId]: action.user }
      };
    case types.RECEIVE_USER_FOLLOWINGS:
      tmp.users[action.userId].followings = action.followings;
      return tmp;
    default:
      return state;
  }
}

export default entities;
