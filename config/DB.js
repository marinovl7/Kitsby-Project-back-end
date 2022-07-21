const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
//
const DB = () => {
	mongoose
		.connect(
			// mongo db uri to connect our database
			process.env.MONGO_URI,

			{
				useNewUrlParser: true,
				useUnifiedTopology: true,

				// ssl: true,
				// sslValidate: true,
				// sslCA: path.join(__dirname, '../ca-certificate (1).crt'),
			}
		)
		.then(() => console.log('Database is connected successfully'))
		.catch(err => console.log(err));
};

module.exports = DB;
