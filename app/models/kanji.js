var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var KanjiSchema   = new Schema({
	kanji: String,
    hiragana: String,
    definition: String,
    translation: String,
    spacing: {type: Number, default: 24*60*60*1000},
    review: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Kanji', KanjiSchema);
