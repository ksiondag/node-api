// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/kanji'); // connect to our database
var Kanji     = require('./app/models/kanji');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var apiRouter = express.Router();

// middleware to use for all requests
apiRouter.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /kanji
// ----------------------------------------------------
apiRouter.route('/kanji')

	// create a kanji (accessed at POST http://localhost:8080/kanji)
	.post(function(req, res) {
		
		var kanji = new Kanji();
		kanji.kanji = req.body.kanji;
		kanji.hiragana = req.body.hiragana;
		kanji.definition = req.body.definition;
		kanji.translation = req.body.translation;

		kanji.save(function(err) {
			if (err) {
				res.send(err);
            }

			res.json({ message: 'Kanji created!' });
		});

		
	})

	// get all the kanji (accessed at GET http://localhost:8080/api/kanji)
	.get(function(req, res) {
		Kanji.find(function(err, kanji) {
			if (err) {
				res.send(err);
            }

			res.json(kanji);
		});
	});

// on routes that end in /kanji/:kanji_id
// ----------------------------------------------------
apiRouter.route('/kanji/:kanji_id')

	// get the kanji with that id
	.get(function(req, res) {
		Kanji.findById(req.params.kanji_id, function(err, kanji) {
			if (err) {
				res.send(err);
            }
			res.json(kanji);
		});
	})

	// update the kanji with this id
	.put(function(req, res) {
		Kanji.findById(req.params.kanji_id, function(err, kanji) {

			if (err) {
				res.send(err);
            }

            kanji.kanji = req.body.kanji || kanji.kanji;
            kanji.hiragana = req.body.hiragana || kanji.hiragana;
            kanji.definition = req.body.definition || kanji.definition;
            kanji.translation = req.body.translation || kanji.translation;

            if (req.body.remembered) {
                kanji.review = new Date(Date.now() + kanji.spacing);
                kanji.spacing *= 2;
            } else {
                kanji.review = new Date(Date.now());
                kanji.spacing = 24*60*60*1000;
            }

			kanji.save(function(err) {
				if (err) {
					res.send(err);
                }

				res.json({ message: 'Kanji updated!' });
			});

		});
	})

	// delete the kanji with this id
	.delete(function(req, res) {
		Kanji.remove({
			_id: req.params.kanji_id
		}, function(err, kanji) {
			if (err) {
				res.send(err);
            }

			res.json({ message: 'Successfully deleted' });
		});
	});



// ROUTES FOR OUR APP
// =============================================================================
var appRouter = express.Router();

appRouter.use(express.static("public"));


// REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouter);
app.use('/', appRouter);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

