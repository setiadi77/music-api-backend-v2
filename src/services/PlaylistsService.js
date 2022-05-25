const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const ClientError = require('../exceptions/ClientError');
const { mapDBToModel } = require('../utils');

// class PlaylistsService {
//     constructor(collaborationService) {
//         this._pool = new Pool();
//         this._collaborationService = collaborationService;
//     }

//     async addPlaylist({ name, owner }) {
//         const id = 'playlist-' + nanoid(16);

//         const query = {
//             text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
//             values: [id, name, owner],
//         };

//         const result = await this._pool.query(query);

//         if (!result.rows[0].id) {
//             throw new InvariantError('Gagal menambahkan playlist');
//         }

//         return result.rows[0].id;
//     }

//     async getPlaylists(owner) {
//         // const queryPlaylist = {
//         //     text: `SELECT playlist_id FROM collaborations WHERE user_id = $1`,
//         //     values: [owner],
//         // };
//         // const resultPlaylist = await this._pool.query(queryPlaylist);

//         // let playlistId = '';
//         // if (resultPlaylist.rows.length) {
//         //     const result = resultPlaylist.rows[0].playlist_id;
//         //     playlistId = result;
//         // }
//         const query = {
//             text: `SELECT playlists.id, playlists.name, users.username FROM playlists
//                     LEFT JOIN users ON users.id = playlists.owner
//                     WHERE playlist.owner = $1 or playlists.id = $2
//                     GROUP BY playlists.id, users.username`,
//             values: [owner],
//         };

//         // const resultOwner = await this._pool.query(queryOwner);
//         // return resultOwner.rows;
//         const result = await this._pool.query(query);
//     return result.rows.map(mapDBToModel);
//     }

//     async deletePlaylistById(playlistId) {
//         const query = {
//             text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
//             values: [playlistId],
//         };

//         const result = await this._pool.query(query);

//         // if (!result.rows.length) {
//         //     throw new NotFoundError('Gagal menghapus. Id tidak ditemukan');
//         // }
//         if (!result.rowCount) {
//             throw new NotFoundError(
//               'Gagal menghapus playlist. Id tidak ditemukan',
//             );
//           }
//     }

//     //async addSongToPlaylist(songId, playlistId, credentialId) {
//         async addSongToPlaylist({songId, playlistId}) {
//         const id = 'playlist_song-' + nanoid(16);

//         const queryCheck = {
//             text: 'SELECT title FROM songs WHERE id = $1',
//             values: [
//               songId,
//             ],
//           };
//           const resultSong = await this._pool.query(queryCheck);

//           if (!resultSong.rows.length) {
//             throw new NotFoundError('Lagu tidak ditemukan');
//           }

//         // const queryPlaylist = {
//         //     text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
//         //     values: [id, songId, playlistId],
//         // };
//         const queryPlaylist = {
//             text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
//             values: [
//               id,
//               playlistId,
//               songId,
//             ],
//           };

//         const result = await this._pool.query(queryPlaylist);

//         if (!result.rows[0].id) {
//             throw new InvariantError('Gagal menambahkan lagu ke playlist');
//         }

//         return result.rows[0].id;
//     }

//     // async getPlaylistSong(id, owner) {
//     //     const playlistId = id;

//     //     const queryPlaylist = {
//     //         text: `SELECT playlists.id, playlists.name, users.username FROM playlists
//     //                 INNER JOIN users ON users.id = playlists.owner
//     //                 WHERE playlists.id = $3 OR owner = $1 and playlists.id = $2`,
//     //         values: [owner, id, playlistId],
//     //     };

//     //     const querySongs = {
//     //         text: `SELECT songs.id, songs.title, songs.performer FROM songs
//     //                 LEFT JOIN playlistsongs
//     //                 ON playlistsongs.song_id = songs.id
//     //                 WHERE playlistsongs.playlist_id = $1 OR playlistsongs.playlist_id = $2`,
//     //         values: [id, playlistId],
//     //     };

//     //     const result = await this._pool.query(queryPlaylist);

//     //     const songs = await this._pool.query(querySongs);

//     //     const combine = {
//     //         ...result.rows[0],
//     //         songs: [
//     //             ...songs.rows],
//     //     };

//     //     if (!result.rows.length) {
//     //         throw new NotFoundError('Playlist tidak ditemukan');
//     //     }

//     //     return combine;
//     // }

//     async getPlaylistSongs(id) {
//         const query = {
//           text: `SELECT playlists.*, users.username, songs.id as song_id, songs.title as song_title, songs.performer FROM playlists
//           LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
//           LEFT JOIN songs ON songs.id = playlist_songs.song_id
//           LEFT JOIN users ON users.id = playlists.owner
//           WHERE playlists.id = $1`,
//           values: [id],
//         };

//         const result = await this._pool.query(query);

//         if (!result.rows.length) {
//           throw new NotFoundError('Playlist not found');
//         }

//         const songs = result.rows.map((row) => ({
//           id: row.song_id,
//           title: row.song_title,
//           performer: row.performer,
//         }));

//         const playlstResult = {
//           id: result.rows[0].id,
//           name: result.rows[0].name,
//           username: result.rows[0].username,
//           songs,
//         };

//         return playlstResult;
//       }

//     // async deleteSongFromPlaylist(id, playlistId) {
//     //     const query = {
//     //         text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
//     //         values: [id, playlistId],
//     //     };

//     //     const result = await this._pool.query(query);

//     //     if (!result.rows.length) {
//     //         throw new ClientError('Gagal menghapus.');
//     //     }
//     // }

//     async deleteSongFromPlaylist(playlistId, songId) {
//         const query = {
//           text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
//           values: [playlistId, songId],
//         };

//         const result = await this._pool.query(query);

//         if (!result.rowCount) {
//           throw new NotFoundError(
//             'Gagal menghapus playlist. Id tidak ditemukan',
//           );
//         }
//       }

//     // async verifyPlaylistOwner(playlistId, userId) {
//     //     const query = {
//     //         text: 'SELECT * FROM playlists WHERE id = $1',
//     //         values: [playlistId],
//     //     };
//     //     const result = await this._pool.query(query);

//     //     if (!result.rows.length) {
//     //         throw new NotFoundError('Playlist tidak ditemukan');
//     //     }

//     //     const playlist = result.rows[0];

//     //     if (playlist.owner !== userId) {
//     //         throw new AuthorizationError('Tidak dapat mengakses');
//     //     }
//     // }

//     async verifyPlaylistOwner(id, owner) {
//         const query = {
//           text: 'SELECT * FROM playlists WHERE id = $1',
//           values: [id],
//         };
//         const result = await this._pool.query(query);
//         if (!result.rows.length) {
//           throw new NotFoundError('Catatan tidak ditemukan');
//         }
//         const playlist = result.rows[0];
//         if (playlist.owner !== owner) {
//           throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
//         }
//       }

//     async verifySongId(id) {
//         const query = {
//             text: 'SELECT * FROM songs WHERE id = $1',
//             values: [id],
//         };

//         const result = await this._pool.query(query);

//         if (!result.rows.length) {
//             throw new NotFoundError('Lagu tidak ditemukan');
//         }
//     }

//     async verifyPlaylistAccess(playlistId, userId) {
//         try {
//             await this.verifyPlaylistOwner(playlistId, userId);
//         } catch (error) {
//             if (error instanceof NotFoundError) {
//                 throw error;
//             }
//             try {
//                 await this._collaborationService.verifyCollaborator(playlistId, userId);
//             } catch {
//                 throw error;
//             }
//         }
//     }
// }

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [
        id,
        name,
        owner,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      WHERE playlists.owner = $1 
      GROUP BY playlists.id, users.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Gagal menghapus playlist. Id tidak ditemukan',
      );
    }
  }

  // bagian service untuk playlist_songs
  async addPlaylistSong({ playlistId, songId }) {
    const querycekSong = {
      text: 'SELECT title FROM songs WHERE id = $1',
      values: [
        songId,
      ],
    };
    const Song = await this._pool.query(querycekSong);

    if (!Song.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [
        id,
        playlistId,
        songId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(id) {
    const query = {
      text: `SELECT playlists.*, users.username, songs.id as song_id, songs.title as song_title, songs.performer FROM playlists
      LEFT JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
      LEFT JOIN songs ON songs.id = playlistsongs.song_id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    const songs = result.rows.map((row) => ({
      id: row.song_id,
      title: row.song_title,
      performer: row.performer,
    }));

    const playlstResult = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs,
    };

    return playlstResult;
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Gagal menghapus playlist. Id tidak ditemukan',
      );
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
