//models from the spotifyComparison project

const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    spotId: String,

    imageHref: String,
    lastAccesed: Date,
    comparisons: [{ //dateLastEdited for displying on the frontend in order + completed 
        from: {
            type: String, //'songs' || 'playlist' || 'album'
            require: true
        },
        fromName: {
            albumName: String,
            artistName: String,
            playlistName: String,
        },
        completed: {
            type: Boolean,
            default: true
        },
        lastEdited: {
            type: Date,
            default: Date(0)
        },
        comparisonPtr: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comparison'
        }
    }]
});

const ComparisonSchema = mongoose.Schema({
    information: [
        [mongoose.Schema.Types.Mixed] // the first array object will be the actual songs, the rest will be numbers refrencing those songs
    ],
    created: Date,
    number: Number,
    lastEdited: Date,

    source: {
        from: {
            type: String,
            require: true
        }, //{playlist, songs, album}
        fromName: {
            albumName: String,
            artistName: String,
            playlistName: String,
        }
    }

});

const SongSchema = mongoose.Schema({
    spotId: {
        type: String,
        require: true
    },
    name: String,
    imageLink: {
        type: String,
        default: "https://place_holder_album_image"
    }
});

const Person = mongoose.model('Person', PersonSchema);
const Song = mongoose.model('Song', SongSchema);
const Comparison = mongoose.model('Comparison', ComparisonSchema);


module.exports = {
    Person: Person,
    Song: Song,
    Comparison: Comparison,
}