'use strict';

// Include the serverless-slack bot framework
const slack = require('serverless-slack');



const axios = require('axios');

// var url = 'https://lqxybkovb1.execute-api.us-east-1.amazonaws.com/dev/rest';

// The function that AWS Lambda will call
exports.handler = slack.handler.bind(slack);






// Slash Command handler
slack.on('/primatwo', (msg, bot) => {

  //check if this is
  console.log(msg)
  const user_id = msg.user_id
  const user_name = msg.user_name

  var url = 'https://qluq1u89ji.execute-api.us-east-1.amazonaws.com/dev/todos/' + user_id
  axios.get(url)
    .then( (response) => {

      console.log(response);

      if (response.data === '') {
        //then i need to create

        //create url
        const create_url = 'https://qluq1u89ji.execute-api.us-east-1.amazonaws.com/dev/todos'

        //set payload
        var payload = {
          "id":user_id,
          "email":user_name
        };


        //create user using endpoint
        axios.post(create_url,payload)
          .then((responseTwo) => {
            console.log(responseTwo)
            let message = {
              // selected button value
              text: "added you to db"
            };
            bot.reply(message)

          })
          .catch(function (error) {
            console.log(error);
          });


      }

      else {
        let message = {
          // selected button value
          text: "you are already in the db"
        };
        bot.reply(message)

        //now i need to check and get the password
        if(msg.text === 'website') {

          let message = {
            // selected button value
            text: "here is your password " + response.data.password + " it was created at " + response.data.updatedAt + " and your username is " + response.data.email
          };
          bot.reply(message)


        }



      }
      //is it null or no-cache




    })
    .catch(function (error) {
      console.log(error);
    });



  //get user id



  // let message = {
  //   text: "How would you like to greet the channel?",
  //   attachments: [{
  //     fallback: 'actions',
  //     callback_id: "greetings_click",
  //     actions: [
  //       { type: "button", name: "Wave", text: ":wave:", value: ":wave:" },
  //       { type: "button", name: "Hello", text: "Hello", value: "Hello" },
  //       { type: "button", name: "Howdy", text: "Howdy", value: "Howdy" },
  //       { type: "button", name: "Hiya", text: "Hiya", value: "Hiya" }
  //     ]
  //   }]
  // };

  // ephemeral reply
  bot.replyPrivate(msg);
});


// Interactive Message handler
slack.on('greetings_click', (msg, bot) => {
  let message = {
    // selected button value
    text: msg.actions[0].value
  };

  // public reply
  bot.reply(message);
});


// Reaction Added event handler
slack.on('reaction_added', (msg, bot) => {
  bot.reply({
    text: ':wave:'
  });
});
