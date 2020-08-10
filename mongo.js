const {
    MongoClient
} = require('mongodb');
const config = require('./config.json');
const chalk = require('chalk');

class MongoBot {
    constructor() {
        const url = config.mongoUrl

        this.client = new MongoClient(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            keepAlive: true,
            connectTimeoutMS: 5000
            // autoReconnect: true
        });
    }
    async init() {
        console.log(chalk.bgRed.black('Connecting to the database'));
        await this.client.connect();
        console.log(chalk.bgGreen.black('Connected to the database!'));

        this.db = this.client.db(config.database);
    }
}

module.exports = new MongoBot();    
