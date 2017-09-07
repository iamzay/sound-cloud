export function getCurrentPlayingId(player, playlists) {
  const { currentSongIndex: current, selectedPlaylist: playlist } = player;
  if (current === null || !playlist) {
    return null;
  }

  const playlistInfo = playlists[playlist];

  return playlistInfo.items[current];
}

export function isSongActive(songId, player) {
  const { currentSongIndex } = player;
  if (currentSongIndex === null) {
    return false;
  }
}
