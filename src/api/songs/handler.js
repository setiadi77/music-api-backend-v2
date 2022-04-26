const ClientError = require("../../exceptions/ClientError");

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongHandler = this.getSongHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const {
                title,
                year,
                performer,
                genre,
                duration,
                albumId
            } = request.payload;
            
            const songId = await this._service.addSong({
                title,
                year,
                performer,
                genre,
                duration,
                albumId
            });

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
            });
            response.code(500);
            return response;
        }
    }//postSongHandler

    async getSongHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs: songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer,
                })),
            },
        };
    }//getSongHandler

    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);

            return {
                status: 'success',
                data: {
                    song,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
            });
            response.code(500);
            return response;
        }
    }//getSongByIdHandler

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;

            await this._service.editSongById(id, request.payload);

            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
            });
            response.code(500);
            return response;
        }
    }//putSongByIdHandler

    async deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params;

            await this._service.deleteSongById(id);

            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
            });
            response.code(500);
            return response;
        }
    }//deleteSongByIdHandler
}

module.exports = SongsHandler;