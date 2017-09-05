import * as types from '../constants/actionTypes.js';

const initialListState = {
  isFetching: false,
  items: [],
  nextUrl: null
};

function playlist(state = initialListState, action) {
  switch (action.type) {
    case types.REQUEST_SONGS:
      return { ...state, isFetching: true };
    case types.RECEIVE_SONGS:
      return {
        isFetching: false,
        items: state.items.concat(action.songs),
        nextUrl: action.nextUrl
      };
    default:
      return state;
  }
}

const initialState = {};

function playlists(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_SONGS:
      return {
        ...state,
        [action.playlist]: playlist(state[action.playlist], action)
      };
    case types.RECEIVE_SONGS:
      return {
        ...state,
        [action.playlist]: playlist(state[action.playlist], action)
      };
    default:
      return state;
  }
}

export default playlists;
