var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var KanjiSchema   = new Schema({
	kanji: String,
    hiragana: String,
    definition: String,
    translation: String
});

module.exports = mongoose.model('Kanji', KanjiSchema);
