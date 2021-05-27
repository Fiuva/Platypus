const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    idDiscord: { type: String, unique: true },
    songs: { type: Object, default: {} },
    color: { type: String, default: '#7289da' }
})

// crear modelo

const Playlist = mongoose.model('playlists', playlistSchema);

module.exports = Playlist;


// quitar exp limite y añadir exp pareja