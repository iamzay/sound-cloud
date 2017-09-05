import { normalize, schema } from 'normalizr';

import * as types from '../constants/actionTypes.js';
import { constructUrl } from '../utils/playlistUtils.js';

function requestSongs(playlist) {
  return {
    playlist,
    type: types.REQUEST_SONGS
  };
}

export function fetchSongsIfNeeded(playlist) {
  return (dispatch, getState) => {
    const { playlists } = getState();

    /* 如果isFetching为true则已经在请求了 */
    if (playlists[playlist] && playlists[playlist].isFetching) {
      return;
    }

    /* 开始请求 */
    dispatch(requestSongs(playlist));

    const url = getNextUrl(playlist, playlists);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        const { collection: songs, next_href: nextUrl } = json;

        const user = new schema.Entity('users');
        const song = new schema.Entity('songs', {
          user: user
        });
        const songList = [song];
        const normalizedData = normalize(songs, songList);

        dispatch(
          receiveSongs(
            normalizedData.entities,
            normalizedData.result,
            playlist,
            nextUrl
          )
        );
      })
      .catch(err => {
        throw err;
      });
  };
}

function receiveSongs(entities, songs, playlist, nextUrl) {
  return {
    type: types.RECEIVE_SONGS,
    entities,
    songs,
    playlist,
    nextUrl
  };
}

function getNextUrl(playlist, playlists) {
  if (!(playlist in playlists) || !playlists[playlist].nextUrl) {
    return constructUrl(playlist);
  }

  return playlists[playlist].nextUrl;
}
