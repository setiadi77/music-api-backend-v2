const mapDBToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at,
    updated_at,
    name,
    album_id,
    song_id,
    username,
    owner,
    playlist_id,
    user_id,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: inserted_at,
    updatedAt: updated_at,
    name,
    albumId: album_id,
    songId: song_id,
    username,
    owner,
    playlistId: playlist_id,
    userId: user_id,
});

module.exports = { mapDBToModel };  