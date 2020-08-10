const axios = require('axios');
const chalk = require('chalk');
const mongo = require('./mongo.js')
const config = require('./config.json')

async function start() {
  console.log(chalk.bgRed.black('Starting'));
  await mongo.init();
  let collection = mongo.db.collection(config.collection)
  setInterval(async () => {
    var arr = await collection.find().toArray()
    var _id = arr[0]._id;
    var arr = arr[0].playerCounts;
    await axios.get(`https://api.minehut.com/server/${config.server}?byName=true`)
      .then(async (response) => {
        let data = response.data.server;
        let time = new Date();
        var minute = time.getMinutes();
        var hour = time.getHours();
        var date = time.toDateString();
        var dateFormat = `${date} | ${hour}:${minute}`
        arr.push({time: dateFormat, count: data.playerCount})
        await collection.updateOne({_id: _id}, {$set: {playerCounts: arr}}, {upsert: true})
        console.log(chalk.bgWhite.black(`Updated at ${dateFormat} with ${data.playerCount} players`))
      })
      .catch(error => {
        console.log(error);
      });
  }, 1000 * 60)
  console.log(chalk.bgGreen.black('Started'));
}

start();
