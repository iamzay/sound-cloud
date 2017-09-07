import * as types from '../constants/actionTypes.js';

const initialState = {
  songs: {},
  users: {}
};

function entities(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_SONGS:
      return {
        songs: { ...state.songs, ...action.entities.songs },
        users: { ...state.users, ...action.entities.users }
      };
    case types.RECEIVE_COMMENTS:
      const tmp = { ...state };
      tmp.songs[action.songId].comments = action.comments;
      return tmp;
    default:
      return state;
  }
}

export default entities;
