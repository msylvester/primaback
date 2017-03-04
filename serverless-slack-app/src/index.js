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
        //
        // let message = {
        //   // selected button value
        //   text: "you are already in the db"
        // };
        // bot.reply(message)

        //now i need to check and get the password
      //  switch(msg.text)

        if(msg.text === 'website') {
          let message = {
            // selected button value
            text: "here is your password " + response.data.password + " it was created at " + response.data.updatedAt + " and your username is " + response.data.email
          };
          bot.reply(message)
        }

        //case user hit quest
        if(msg.text === 'survey') {

          //  see if they want to view
          let message = {
            text: "Would you like to view your Surveys?",
            attachments: [{
              fallback: 'actions',
              callback_id: "view_existing_surveys",
              actions: [
                { type: "button", name: "view", text: "view", value: "view" },
                { type: "button", name: "distribute", text: "distribute", value: "distribute" }

              ]
            }]
          };

          bot.reply(message)
        }

        //case user hit quest
        if(msg.text === 'help') {

            let msg_help = {

              text:"Thank you for installing Prima.  I can do many awesome things including \n *survey* \n *feedback** \n *schedule* \n *generate website credentials*"
            }

            bot.reply(msg_help)

        }


        try {

          const messages = msg.text.split(" ");
          const user_acton = messages[1]

          //get request to slack api to see if user is present



          if(messages[0] === 'feedback') {


            //get request to slack to api to se iff user i present


            // let message = {
            //   // selected button value
            //   text: "please type prima followed by your question and I will send it to " + messages[1]
            // }
            // bot.reply(message)
          }

          if(messages[0] === 'schedule') {



            //  see if they want to view
            let message = {
              text: `When would you like to schedule your convo with ${messages[1]}`,
              attachments: [{
                fallback: 'actions',
                callback_id: "schedule_hangout",
                actions: [
                  { type: "button", name: "one", text: "1hr", value: `one ${messages[1]}` },
                  { type: "button", name: "thirty", text: "30min", value: `thirty ${messages[1]}` },
                  { type: "button", name: "onehalf", text: "1.5hr", value: `onehalf ${messages[1]}` },
                  { type: "button", name: "two", text: "2hr", value: `two ${messages[1]}`  }

                ]
              }]
            };

            bot.reply(message)

            return

          }

        }

        catch (error)  {

          let message = {
            // selected button value
            text: "Prima could not recognize that command ask her for help to see her resources"
          }

          bot.reply(message)

          console.log("coulnd find the user or somehtin")
        }


    })
    .catch(function (error) {
      console.log(error);
    });


});


//Interactive Messaging
// Interactive Message handler
slack.on('schedule_hangout', (msg, bot) => {

  let timestamp = new Date().getTime();
  const size_two = msg.actions[0].value.split(' ')
  const a = size_two[0]
  if  (size_two[0] === 'thirty')  {

    timestamp += 30

  }

  if  (a === 'one')  {

    timestamp += 60
  }

  if  (a === 'onehalf')  {

    timestamp += 90
  }

  if  (a === 'two')  {
    timestamp += 120
  }


  //effectively you want to add an instance to a ddatvase o
  const create_url = ''

  const payload = {
     organizer:msg.user_id,
     participant:size_two[1],
     team_id: msg.team_id
  }

  //create user using endpoint
  axios.post(create_url,payload)

    .then((responseCreateSchedule) => {

        let msg_schedule = {

          text:"alright your appointment with " + size_two[1] + " has been scheduled at " + timestamp

        }

        console.log("user has been added")

    })
    .catch((error) => {
      console.log(error);
    });


})

// Interactive Message handler
slack.on('view_existing_surveys', (msg, bot) => {



    var message = {
        // selected button value
        text: "cool, distributing..."
      };

  if  (msg.actions[0].value === 'distribute')  {

    // public reply
    bot.reply(message);

  }

  if( msg.actions[0].value === 'view') {
    //we want tp get all surveys that belong to your brand
    const url = 'https://0www3cuk3j.execute-api.us-east-1.amazonaws.com/dev/surveys'


    axios.get(url)
      .then( (response) => {
          console.log("In the url for axiso ser")
          try {
                const team_id = msg.team_id
              }
          catch(err){
              console.log(`couldnt print the arrays as necessary `)
              message.text = "riun"
              bot.reply(message)

          }

        try {
          var array_of_surveys = response.data
          message.text = array_of_surveys
          bot.reply(message);
        }

        catch(err){
            console.log(`couldnt print the arrays as necessary `)

        }



        if(array_of_surveys.filter(survey => survey.team_id === msg.team_id).length > 0) {

          const final_array_of_survey = array_of_surveys.filter(survey => survey.team_id === msg.team_id)


          if (final_array_of_survey.length === 1) {
            const lclSurvey = final_array_of_survey[0]
            const lclSurveyId = lclSurvey.id
            console.log (`${lclSurveyId}`)
            let message = {
              text: "Which survey would you like to view?",
              attachments: [{
                fallback: 'actions',
                callback_id: "show_the_questions",
                actions: [
                  { type: "button", name:  `${lclSurveyId}`, text: `${lclSurveyId}`, value: `${lclSurveyId}` }
                ]
              }]
            };


          }

          if (final_array_of_survey.length === 2) {


            const lclSurvey = final_array_of_survey[0]
            const lclSurveyId = lclSurvey.id

            const lclSurveyTwo = final_array_of_survey[1]
            const lclSurveyTwoId = lclSurveyTwo.id

            console.log (`${lclSurveyId}`)
            let message = {
              text: "Which survey would you like to view?",
              attachments: [{
                fallback: 'actions',
                callback_id: "show_the_questions",
                actions: [
                  { type: "button", name:  `${lclSurveyId}`, text: `${lclSurveyId}`, value: `${lclSurveyId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` }
                ]
              }]
            };



          }






        }

        else {
          message.text = "you need to create some surveys"
          bot.reply(message);
        }



      })
      .catch(function (error) {
        console.log(error);
      });


  }


});



// Reaction Added event handler
slack.on('show_the_questions', (msg, bot) => {

    //basically what we want to do is get the survey
    const survey =  msg.actions[0].value

    //get url endpoint
    const url = 'https://0www3cuk3j.execute-api.us-east-1.amazonaws.com/dev/surveys'+survey

    //get request to get the survey
    axios.get(url)
      .then((response) => {
          try {
                const questions = response.data.questions

                questions.forEach((question) => {

                    var mans = {
                      text:question
                    }
                    bot.reply(mans)
                  }

                )
            }

          catch (err) {
            console.log("There was an error")
            return
          }
      })
      .catch((error) => {
          console.log(error);
       });


    //print the questgins


});

// Reaction Added event handler
slack.on('reaction_added', (msg, bot) => {
  bot.reply({
    text: ':view:'
  });
});
