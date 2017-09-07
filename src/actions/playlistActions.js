import { normalize } from 'normalizr';

import * as types from '../constants/actionTypes.js';
import { changeCurrentPlaylist } from './playerActions.js';
import { SONG_PLAYLIST_SUFFIX } from '../constants/playlist.js';
import { songSchema } from '../constants/Schemas.js';
import {
  constructUrl,
  constructSongUrl,
  constructSongCommentsUrl,
  constructUserSongsUrl,
  normalizeSongs
} from '../utils/playlistUtils.js';

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
        const normalizedData = normalizeSongs(songs);
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

export function fetchSongIfNeeded(songId) {
  return (dispatch, getState) => {
    const { entities: { songs } } = getState();
    if (!songs[songId]) {
      dispatch(fetchSong(songId));
    } else {
      dispatch(receiveSong({}, songId, songs));
    }
  };
}

function fetchSong(songId) {
  return dispatch => {
    dispatch(requestSong(songId));
    return fetch(constructSongUrl(songId))
      .then(response => response.json())
      .then(json => {
        const normalized = normalize(json, songSchema);
        dispatch(
          receiveSong(normalized.entities, songId, normalized.entities.songs)
        );
      })
      .catch(err => {
        throw err;
      });
  };
}

function receiveSong(entities, songId, songs) {
  return (dispatch, getState) => {
    const { playlists } = getState();
    const song = songs[songId];
    const playlistKey = song.title + SONG_PLAYLIST_SUFFIX;
    dispatch(changeCurrentPlaylist(playlistKey));

    /* 如果已有这张表了，则无需请求 */
    if (playlists[playlistKey]) {
      return;
    }

    /* 否则新建一张表，并请求相关的歌曲 */
    dispatch(receiveSongs(entities, [songId], playlistKey, null));
    dispatch(fetchRelatedSongs(song.user_id, song.title));
    /* 请求这首歌的评论 */
    dispatch(fetchComments(songId));
  };
}

function requestSong(songId) {
  return {
    type: types.REQUEST_SONG,
    songId
  };
}

function fetchComments(songId) {
  return dispatch =>
    fetch(constructSongCommentsUrl(songId))
      .then(response => response.json())
      .then(json => dispatch(receiveSongComments(songId, json)))
      .catch(err => {
        throw err;
      });
}

function receiveSongComments(songId, data) {
  return {
    type: types.RECEIVE_COMMENTS,
    comments: data,
    songId
  };
}

function fetchRelatedSongs(userId, songTitle) {
  return dispatch =>
    fetch(constructUserSongsUrl(userId))
      .then(response => response.json())
      .then(json => {
        const songs = json.filter(song => songTitle !== song.title);
        const normalizedData = normalizeSongs(songs);
        dispatch(
          receiveSongs(
            normalizedData.entities,
            normalizedData.result,
            songTitle + SONG_PLAYLIST_SUFFIX,
            null
          )
        );
      })
      .catch(err => {
        throw err;
      });
}
