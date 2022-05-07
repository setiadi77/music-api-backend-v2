const playlist = (handler) => [
    // {
    //     method: 'POST',
    //     path: '/playlists',
    //     handler: handler.postPlaylistHandler,
    //     options: {
    //         auth: 'musicapp_jwt',
    //     },
    // },
    // {
    //     method: 'GET',
    //     path: '/playlists',
    //     handler: handler.getPlaylistsHandler,
    //     options: {
    //         auth: 'musicapp_jwt',
    //     },
    // },
    // {
    //     method: 'DELETE',
    //     path: '/playlists/{id}',
    //     handler: handler.deletePlaylistByIdHandler,
    //     options: {
    //         auth: 'musicapp_jwt',
    //     },
    // },
    // {
    //     method: 'POST',
    //     path: '/playlists/{id}/songs',
    //     handler: handler.postSongToPlaylistHandler,
    //     options: {
    //         auth: 'musicapp_jwt',
    //     },
    // },
    // {
    //     method: 'GET',
    //     path: '/playlists/{id}/songs',
    //     handler: handler.getSongsInPlaylistHandler,
    //     options: {
    //         auth: 'musicapp_jwt',
    //     },
    // },
    // {
    //     method: 'DELETE',
    //     path: '/playlists/{id}/songs',
    //     handler: handler.deleteSongFromPlaylistHandler,
    //     options: {
    //         auth: 'musicapp_jwt',
    //     },
    // },
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
          auth: 'musicapp_jwt',
        },
      },
      {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
        options: {
          auth: 'musicapp_jwt',
        },
      },
      {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistByIdHandler,
        options: {
          auth: 'musicapp_jwt',
        },
      },
      {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistSongHandler,
        options: {
          auth: 'musicapp_jwt',
        },
      },
      {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getPlaylistSongByIdHandler,
        options: {
          auth: 'musicapp_jwt',
        },
      },
      {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deletePlaylistSongByIdHandler,
        options: {
          auth: 'musicapp_jwt',
        },
      },
];

module.exports = playlist;