const csv = require('csv-parser');
const fs = require('fs');
const seeder = require('mongoose-seed');
require("dotenv").config();
const db = process.env.MONGO_URL;

const questions = [];

const filter = (text) => {
  const following = RegExp("the following");
  const these = RegExp("these");
  return following.test(text) || these.test(text);
};

fs.createReadStream("db/easy.csv")
  .pipe(csv({ separator: "\t", headers: ["text", "answer"] }))
  .on("data", (data) => {
    if (!filter(data.text)) {
      data.category = "EASY";
      data.value = 1;
      return questions.push(data);
    } else return;
  })
  .on("end", () => {
    console.log(questions[0]);
  });

fs.createReadStream("db/hard.csv")
  .pipe(csv({ separator: "\t", headers: ["text", "answer"] }))
  .on("data", (data) => {
    if (!filter(data.text)) {
      data.category = "HARD";
      data.value = 2;
      return questions.push(data);
    } else return;
  })
  .on("end", () => {
    console.log(questions[questions.length-1]);
  });

const data = [{
  'model': 'question',
  'documents': questions
}];

seeder.connect(db, function() {
  seeder.loadModels(["db/models/Question.js"]);
  seeder.clearModels(['question'], function() {
    seeder.populateModels(data, function(err, done) {
    if (err) {
      return console.log("seed err", err);
    };
    if (done) {
      return console.log("seed done", done);
    }
    seeder.disconnect();
  });
  });  
});