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
		
		var kanji = new Kanji();		// create a new instance of the Kanji model
		kanji.kanji = req.body.kanji;  // set the kanji kanji (comes from the request)
		kanji.hiragana = req.body.hiragana;  // set the kanji hiragana (comes from the request)
		kanji.definition = req.body.definition;  // set the kanji definition (comes from the request)
		kanji.translation = req.body.translation;  // set the kanji translation (comes from the request)

		kanji.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Kanji created!' });
		});

		
	})

	// get all the kanji (accessed at GET http://localhost:8080/api/kanji)
	.get(function(req, res) {
		Kanji.find(function(err, kanji) {
			if (err)
				res.send(err);

			res.json(kanji);
		});
	});

// on routes that end in /kanji/:kanji_id
// ----------------------------------------------------
apiRouter.route('/kanji/:kanji_id')

	// get the kanji with that id
	.get(function(req, res) {
		Kanji.findById(req.params.kanji_id, function(err, kanji) {
			if (err)
				res.send(err);
			res.json(kanji);
		});
	})

	// update the kanji with this id
	.put(function(req, res) {
		Kanji.findById(req.params.kanji_id, function(err, kanji) {

			if (err)
				res.send(err);

            kanji.kanji = req.body.kanji;  // set the kanji kanji (comes from the request)
            kanji.hiragana = req.body.hiragana;  // set the kanji hiragana (comes from the request)
            kanji.definition = req.body.definition;  // set the kanji definition (comes from the request)
            kanji.translation = req.body.translation;  // set the kanji translation (comes from the request)
			kanji.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Kanji updated!' });
			});

		});
	})

	// delete the kanji with this id
	.delete(function(req, res) {
		Kanji.remove({
			_id: req.params.kanji_id
		}, function(err, kanji) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouter);

// ROUTES FOR OUR APP
// =============================================================================
var appRouter = express.Router();


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
