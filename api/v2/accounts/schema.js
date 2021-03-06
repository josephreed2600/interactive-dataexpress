const mongoose = require('mongoose');
const validator = require('./validate');
const { wrapErrorForMongoose } = require('../util');

const accountSchema = mongoose.Schema({
	username: {
		type: String,
		unique: ['Username is already taken'],
		required: [ validator.exist.username ],
		validate: { validator: wrapErrorForMongoose(validator.valid.username) }
	},

	password: {
		type: String,
		required: [ validator.exist.password ]
		// Mongoose/MongoDB doesn't need to know squat about validating our
		// passwords, because it will only ever get hashed output from bcrypt.
	},

	email: {
		type: String,
		required: [ validator.exist.email ],
		validate: { validator: wrapErrorForMongoose(validator.valid.email) }
	},

	dob: {
		type: Date,
		required: [ validator.exist.dob ],
		validate: { validator: wrapErrorForMongoose(validator.valid.dob) }
	},

	answers: {
		type: [Number],
		required: [ validator.exist.answers ],
		validate: { validator: wrapErrorForMongoose(validator.valid.answers) }
	}

});

module.exports = mongoose.model('Accounts', accountSchema);
