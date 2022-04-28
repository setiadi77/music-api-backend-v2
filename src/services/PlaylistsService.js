const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const ClientError = require('../exceptions/ClientError');

class PlaylistsService {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    async addPlaylist({ name, owner }) {
        const id = 'playlist-' + nanoid(16);

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Gagal menambahkan playlist');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const queryPlaylist = {
            text: `SELECT playlist_id FROM collaborations WHERE user_id = $1`,
            values: [owner],
        };
        const resultPlaylist = await this._pool.query(queryPlaylist);

        let playlistId = '';
        if (resultPlaylist.rows.length) {
            const result = resultPlaylist.rows[0].playlist_id;
            playlistId = result;
        }
        const queryOwner = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
                    LEFT JOIN users ON users.id = playlists.owner
                    WHERE owner = $1 or playlists.id = $2`,
            values: [owner, playlistId],
        };

        const resultOwner = await this._pool.query(queryOwner);

        console.log();

        return resultOwner.rows;
    }

    async deletePlaylistById(playlistId) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal menghapus. Id tidak ditemukan');
        }
    }

    async addSongToPlaylist(songId, playlistId, credentialId) {
        const id = 'playlist_song-' + nanoid(16);
        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, songId, playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Gagal menambahkan lagu ke playlist');
        }

        return result.rows[0].id;
    }

    async getPlaylistSong(id, owner) {
        const playlistId = id;

        const queryPlaylist = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
                    INNER JOIN users ON users.id = playlists.owner 
                    WHERE playlists.id = $3 OR owner = $1 and playlists.id = $2`,
            values: [owner, id, playlistId],
        };

        const querySongs = {
            text: `SELECT songs.id, songs.title, songs.performer FROM songs
                    LEFT JOIN playlistsongs
                    ON playlistsongs.song_id = songs.id
                    WHERE playlistsongs.playlist_id = $1 OR playlistsongs.playlist_id = $2`,
            values: [id, playlistId],
        };

        const result = await this._pool.query(queryPlaylist);

        const songs = await this._pool.query(querySongs);

        const combine = {
            ...result.rows[0],
            songs: [
                ...songs.rows],
        };

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return combine;
    }

    async deleteSongFromPlaylist(id, playlistId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
            values: [id, playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new ClientError('Gagal menghapus.');
        }
    }

    async verifyPlaylistOwner(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== userId) {
            throw new AuthorizationError('Tidak dapat mengakses');
        }
    }

    async verifySongId(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
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
}

module.exports = PlaylistsService;