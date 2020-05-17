let logger = require('../../logger').get('API::Questions');
let dblogger = require('../../logger').get('API::Questions::DB');
const validator = require('./questions/validate');
require('dotenv').config();

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@thedataexpress-wuepb.mongodb.net/test?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
let db = mongoose.connection;
db.on('error', dblogger.error);
db.once('open', () => dblogger.info('Connected'));

let Question, Questions;
const createDB = () => {
	if(!db.models.hasOwnProperty('Questions'))
	Questions = mongoose.model('Questions', require('./questions/schema'));
	Question = Questions; // link; sometimes Questions makes sense, and sometimes Question makes sense
};

const create = async (questionDetails) => {
	// Minimal input validation: ensure that all parameters are present
	if (!questionDetails) throw `Missing question description`;
	let params = ['question', 'options'];
	params.forEach((param) => {
		if (questionDetails[param] == null || questionDetails[param] == undefined) throw `Missing parameter ${param}`;
		validator.validate(param, questionDetails[param]);
	});

	let question = new Question(questionDetails);
	return question.save((err) => {
		// attempt to make error pretty, if we know what it is
		if (err) {
			// we don't know what the error is, so just mongo-barf
			throw err;
			// uhhhhhh wat
			// does this do anything
		}
		// if there's no error, there's nothing to do
		return true;
	});
};

// returns a not-promise:
//   https://mongoosejs.com/docs/queries.html#queries-are-not-promises
// just treat it like one; i.e.:
//   get('xXx_EdgyName_xXx').then(user => {})
const getOne = async (id) => {
	if(!id) throw `Question ID was not provided`;
	return Questions.findById(
		id,
		(err, question) => {
			if (err) throw err;
			return question;
		}
	).exec();
};

const getAll = async () => {
	return Questions.find({},
		(err, questions) => {
			if (err) throw err;
			return questions;
		}
	).exec();
};

createDB();
module.exports = {
	create,
	getOne,
	getAll
	// update,
	// remove
};
