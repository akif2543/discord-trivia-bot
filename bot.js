require('dotenv').config();
const fetch = require('node-fetch')
const url = 'localhost:3000/'

const Discord = require('discord.js');
const client = new Discord.Client();

const getLeader = async url => {
    try {
          const response = await fetch(url);
          let json = await response.json();
          let board = "";
          let i = 1;
          json.forEach(player => {
              board += `${i}. ${player.name}: ${player.score}\n`
              i++
          });
          return board.trim();
        } catch(err) {
            console.log(err);
    };
};

const newPlayer = async url => {
  try {
    const response = await fetch(url, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' } 
    });
    const json = await response.json();
    return json.name
  } catch (err) {
    console.log(err);
  }
};

const getPlayer = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json
  } catch (err) {
    console.log(err);
  }
};

const getQuestion = async url => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch(err) {
        console.log(err);
    };
};

const getResponses = async (question, message) => {
    // filter for responses > 3 chars and included in answer
    let answer = question.answer.toLowerCase();
    const filter = msg => {
        if (msg.content.startsWith('?t')) {
             msg.reply(`if you say so...`);
            let response = msg.content.slice(3);
            let words = response.split(' ');
            let condition = false;
            words.forEach(word => {
                if (answer.includes(word.toLowerCase()) && word.length > 3 ) {
                    condition = true;
                };
            })
            return condition;
        } else {
            return false;
        }
    };
    const collector = message.channel.createMessageCollector(filter, {
      time: 30000,
    });

    collector.on("collect", async msg => {
      console.log(`Collected ${msg}`);
      const player = await getPlayer(
        `http://localhost:3000/players?player=${msg.author.username}`
      );
      let id = player.id;
      let value = question.value;
      const update = await addPoints(`http://localhost:3000/players/${id}?value=${value}`)
    });

    collector.on("end", async (collected) => {
      console.log(`Collected ${collected.size} items`);
      message.channel.send(`The correct answer was: ${question.answer}`)
      let board = await getLeader(`http://localhost:3000/players`);
        message.channel.send(`the current leaderboard is:\n ${board}`);
    });
};

const addPoints = async url => {
    try {
    const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    return json;
    } catch (err) {
    console.log(err);
    }
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.login(process.env.DISCORD_TOKEN);

client.on('message', async msg => {
    if (msg.content.startsWith('!t')) {
        let command = msg.content.split(' ')
        const options = { port: 3000 }
        if (command.length > 1) {
          switch (command[1].toLowerCase()) {
            case "leaderboard":
              let limit;
              if (command[2]) {
                limit = parseInt(command[2]);
              }
              let path = limit ? `/players?limit=${limit}` : "/players";
              let board = await getLeader(`http://localhost:3000${path}`);
              msg.reply(`the current leaderboard is:\n ${board}`);
              break;
            case 'join':
                let name = await newPlayer(
                  `http://localhost:3000/players?name=${msg.author.username}`
                );
                msg.reply(`you have joined the game as ${name}.`);
                break;
            case 'score':
                let player = await getPlayer(
                  `http://localhost:3000/players?player=${msg.author.username}`
                );
                msg.reply(`your current score is ${player.score}.`)
                break;
            case 'question':
                let difficulty;
                if (command[2]) {
                    difficulty = command[2].toUpperCase();
                };
                let diff = difficulty ? `/questions?difficulty=${difficulty}` : '/questions';
                let question = await getQuestion(`http://localhost:3000${diff}`);
                let questionText = question.question_text;
                msg.reply(questionText + '\nYou have 30 seconds to answer! Type ?t before your response. If this is your first time join the game with !t join before you answer.');
                getResponses(question, msg);
          }
        } else {
            return;
        }
    } else {
        return
    };
});

// else if (msg.content.startsWith("?t")) {
//         msg.reply('Are you sure about that answer?')

// client.on('message', msg => {
//     var words = msg.content.split(' ')
//     var url = 'https://mysterious-woodland-51815.herokuapp.com/responses'
//     var query = words.splice(1, words.length).join('&')
//     if (words[0] === '!bet') {
//         console.log(url + '?' + query);
//         request(url + '?' + query, {
//           json: true
//         }, (err, res, content) => {
//             if (err) {
//                 return console.log(err);
//             }
//         msg.channel.send('Hello');
//         msg.channel.send(content.body);
//     }
//     )}
// });



// const req = await http
//   .get(options, (res) => {
//     const { statusCode } = res;
//     const contentType = res.headers["content-type"];

//     let error;
//     if (statusCode !== 200) {
//       error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
//     } else if (!/^application\/json/.test(contentType)) {
//       error = new Error(
//         "Invalid content-type.\n" +
//           `Expected application/json but received ${contentType}`
//       );
//     }
//     if (error) {
//       console.error(error.message);
//       // consume response data to free up memory
//       res.resume();
//       return;
//     }
//     res.setEncoding("utf8");
//     let rawData = "";
//     res.on("data", (chunk) => {
//       rawData += chunk;
//     });
//     res.on("end", () => {
//       try {
//         const parsedData = JSON.parse(rawData);
//         console.log(parsedData);
//       } catch (e) {
//         console.error(e.message);
//       }
//     });
//   })
//   .on("error", (e) => {
//     console.error(`Got error: ${e.message}`);

    // const response = await res.json()
    // 
//   });