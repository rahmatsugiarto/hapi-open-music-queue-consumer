const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsInPlaylist(playlistId) {
    const playlistQuery = {
      text: `
      SELECT playlists.id, playlists.name, users.username 
      FROM playlists 
      JOIN users ON playlists.owner = users.id 
      WHERE playlists.id = $1
    `,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);
    const playlistInfo = playlistResult.rows[0];

    const songsQuery = {
      text: `
      SELECT songs.id, songs.title, songs.performer 
      FROM playlist_songs 
      JOIN songs ON playlist_songs.song_id = songs.id 
      WHERE playlist_songs.playlist_id = $1
    `,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);
    const songs = songsResult.rows;

    return {
      id: playlistInfo.id,
      name: playlistInfo.name,
      username: playlistInfo.username,
      songs,
    };
  }
}

module.exports = PlaylistService;
