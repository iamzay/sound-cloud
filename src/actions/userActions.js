import { normalize } from 'normalizr';

import {
  constructUserFollowingsUrl,
  constructUserTracksUrl,
  constructUserUrl,
  constructUserProfilesUrl
} from '../utils/UserUtils';
import * as types from '../constants/ActionTypes';
import { USER_PLAYLIST_SUFFIX } from '../constants/playlist.js';
import { songListSchema, userListSchema } from '../constants/Schemas.js';
import { receiveSongs } from '../actions/playlistActions.js';

export function fetchUserIfNeeded(userId) {
  return (dispatch, getState) => {
    const { entities: { users } } = getState();
    if (!users[userId]) {
      dispatch(fetchUser(userId));
    } else if (!users[userId].followings) {
      dispatch(fetchUserData(userId));
    }
  };
}

function fetchUser(userId) {
  return dispatch => {
    dispatch(requestUser(userId));
    fetch(constructUserUrl(userId))
      .then(res => res.json())
      .then(json => {
        dispatch(receiveUser(json.id, json));
        dispatch(fetchUserData(userId));
      })
      .catch(err => {
        throw err;
      });
  };
}

function requestUser(userId) {
  return {
    type: types.REQUEST_USER,
    userId
  };
}

function receiveUser(userId, user) {
  return {
    type: types.RECEIVE_USER,
    user,
    userId
  };
}

function fetchUserData(userId) {
  dispatch(fetchUserTracks(userId));
  dispatch(fetchUserFollowings(userId));
}

function fetchUserTracks(userId) {
  return (dispatch, getState) => {
    const { entities: { users } } = getState();
    fetch(constructUserTracksUrl(userId))
      .then(res => res.json())
      .then(json => {
        const normalized = normalize(json, songListSchema);
        dispatch(
          receiveSongs(
            normalized.entities,
            normalized.result,
            users[userId].USER_PLAYLIST_SUFFIX,
            null
          )
        );
      })
      .catch(err => {
        throw err;
      });
  };
}

function fetchUserFollowings(userId) {
  return dispatch => {
    fetch(constructUserFollowingsUrl(userId))
      .then(res => res.json())
      .then(json => {
        /* this is an array */
        const users = json.collection;
        dispatch(receiveUserFollowings(users, userId));
      })
      .catch(err => {
        throw err;
      });
  };
}

function receiveUserFollowings(users, userId) {
  return {
    type: types.RECEIVE_USER_FOLLOWINGS,
    followings: users,
    userId
  };
}
