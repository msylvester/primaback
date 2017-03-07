'use strict';

// Include the serverless-slack bot framework
const slack = require('serverless-slack');



const axios = require('axios');

// var url = 'https://lqxybkovb1.execute-api.us-east-1.amazonaws.com/dev/rest';

// The function that AWS Lambda will call
exports.handler = slack.handler.bind(slack);

//helper method to find users
function find_users(messages) {

    const slack_url_users_list = `https://slack.com/api/users.list?token=${slack_token}&pretty=1`
    const recipient = messages[1]

    axios.get(slack_url_users_list)
      .then( (response) => {

          console.log('going to see if this user is in the list')

          let all_members = response['members']

          let member_array = all_members.reduce((array_of_non_bot_members, member) => {

                array_of_non_bot_members.push(member['name'])

          }, [])

          if (member_array.findIndex(x=> x===recipient) > 0) {
              //good they are in the arrray
              let error_message = {
                  text: `the user ${recipient} is an active memeber of you team ${member_array}`
              }

              bot.reply(error_message)

              try {
                if(messages[0] === 'feedback') {


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

          }

          else {
            let error_message = {
                text: `the user ${recipient} is not an active user in your team`
            }

            bot.reply(error_message)


          }
        })

      .catch((error)=> {

        let error_message = {
            text: "there was an errror get the lenght of input"
        }

        bot.reply(error_message)
      })

  return

}




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


          //call function which handles all the shit



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

      let messages = ''
      let length_of_input = -1
      let user_action = ''
      let recipient = ''
      let slack_token = 'xoxp-133076293744-133714462291-150730926532-c7d52efd1a86a02a534de88d461437a0'


        try {
          //
          messages =  msg.text.split(" ");
          length_of_input = messages.length

        }
        catch(error) {

          let error_message = {
              text: "there was an errror get the lenght of input"
          }

          bot.reply(error_message)
          return
        }


        //check to see lenght

        if(length_of_input === 1) {

          if(msg.text === 'website') {
            let message = {
              // selected button value
              text: "here is your password " + response.data.password + " it was created at " + response.data.updatedAt + " and your username is " + response.data.email
            };
            bot.reply(message)
          }

          //case user hit quest
          else if(msg.text === 'survey') {

              // let t =  {
              //
              //   text:"sferf"
              // }
              //
              // bot.reply(t)
            //  see if they want to view
            const team_id = msg.team_id

            let message = {
              text: "Would you like to view your Surveys?",
              attachments: [{
                fallback: 'actions',
                callback_id: "view_existing_surveys",
                actions: [
                  { type: "button", "style": "primary",name: "view", text: "view", value: `view` },
                  { type: "button", name: "distribute", text: "distribute", value: `distribute` }

                ]
              }]
            };

            bot.reply(message)
          }

          //case user hit quest
          else if(msg.text === 'help') {

              let msg_help = {

                text:"Thank you for installing Prima.  I can do many awesome things including \n *survey* \n *feedback* \n *schedule* \n *generate website credentials*"
              }

              bot.reply(msg_help)

          }

          else {
            let msg_hey =  {

              text: "doesnt work"
            }
            bot.reply(msg_hey)
          }

        }


        else if (length_of_input === 2) {

        //verify that second input

        find_users(messages)

        }

        else {
          let msg_help = {

            text:"Prima can only understand the following commands"
          }

          bot.reply(msg_help)


        }
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

  // let t =  {
  //
  //   text: msg.actions[0].value
  // }
  //
  // bot.reply(t)
  //
  // cosole.log(`here in this mother fucker ${msg}`)
    // var message = {
    //     // selected button value
    //     text: "distributed hit this hook"
    //   };
    //     bot.reply(message);
  console.log(msg)

  let survey = msg.actions[0].value
  let splitSurvey = survey.split("-")
  //let team_id = splitSurvey[1]
  let team_id = msg['team']['id']

  if  (msg.actions[0].value === 'distribute')  {

    // public reply
    let a = {text: "goddamnit this sux"}
    bot.reply(a);

  }

  if( msg.actions[0].value === 'view') {
    //we want tp get all surveys that belong to your brand
    // let m =  {
    //
    //   text:"bitch i am in the view"
    // }
    // bot.reply(m)

    const url = 'https://0www3cuk3j.execute-api.us-east-1.amazonaws.com/dev/surveys'


    axios.get(url)
      .then( (response) => {

          console.log("In the url for axiso ser")

          let array_of_surveys = []

          // try {
          //       team_id= msg.team_id
          //     }
          // catch(err){
          //     console.log(`couldnt print the arrays as necessary `)
          //       let a = {text: "goddamnit this sux lets gett this error"}
          //     bot.reply(a)
          //
          // }

          try {
            array_of_surveys = response.data
            console.log(`the array of surveys data is ${response}`)
            // message.text = array_of_surveys
            // bot.reply(message);
          }

          catch(err){
            var message_Two = {
                // selected button value
                text: "There were serious problems"
              };
              bot.reply(message_Two);

              console.log(`couldnt print the arrays as necessary `)

          }

        // let a = {text: "goddamnit this sux"}
        // bot.reply(a);
        console.log(`the team id is ${team_id}`)
        console.log(`array of surveys is ${array_of_surveys}`)
        console.log(`the filtered value is ${array_of_surveys.filter(survey => survey.team_id === team_id)}`)
        let new_array_survey = []
        array_of_surveys.forEach((survey) => {
                console.log(survey.team_id)
                if(survey.team_id === team_id) {
                  new_array_survey.push(survey)
                }
        }
      )
      console.log(`${new_array_survey.length} has a length of `)

        // if(new_array_survey.length > 0) {
        //
        //   const final_array_of_survey = array_of_surveys.filter(survey => survey.team_id === team_id)
          if (new_array_survey.length === 0) {
              let message = {
              text:''}
              message.text = "you need to create some surveys"
              bot.reply(message);
            }

          if (new_array_survey.length === 1) {
            const lclSurvey = new_array_survey[0]
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
              bot.reply(message)

          }

          if (new_array_survey.length === 2) {


            const lclSurvey = new_array_survey[0]
            const lclSurveyId = lclSurvey.id

            const lclSurveyTwo = new_array_survey[1]
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


          if (new_array_survey.length === 3) {


            const lclSurvey = new_array_survey[0]
            const lclSurveyId = lclSurvey.id

            const lclSurveyTwo = new_array_survey[1]
            const lclSurveyTwoId = lclSurveyTwo.id

            console.log (`${lclSurveyId}`)
            let message = {
              text: "Which survey would you like to view?",
              attachments: [{
                fallback: 'actions',
                callback_id: "show_the_questions",
                actions: [
                  { type: "button", name:  `${lclSurveyId}`, text: `${lclSurveyId}`, value: `${lclSurveyId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` }
                ]
              }]
            };

          }
          if (new_array_survey.length === 4) {


            const lclSurvey = new_array_survey[0]
            const lclSurveyId = lclSurvey.id

            const lclSurveyTwo = new_array_survey[1]
            const lclSurveyTwoId = lclSurveyTwo.id

            console.log (`${lclSurveyId}`)
            let message = {
              text: "Which survey would you like to view?",
              attachments: [{
                fallback: 'actions',
                callback_id: "show_the_questions",
                actions: [
                  { type: "button", name:  `${lclSurveyId}`, text: `${lclSurveyId}`, value: `${lclSurveyId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` }
                ]
              }]
            };

          }

          if (new_array_survey.length === 5) {


            const lclSurvey = new_array_survey[0]
            const lclSurveyId = lclSurvey.id

            const lclSurveyTwo = new_array_survey[1]
            const lclSurveyTwoId = lclSurveyTwo.id

            console.log (`${lclSurveyId}`)
            let message = {
              text: "Which survey would you like to view?",
              attachments: [{
                fallback: 'actions',
                callback_id: "show_the_questions",
                actions: [
                  { type: "button", name:  `${lclSurveyId}`, text: `${lclSurveyId}`, value: `${lclSurveyId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` },
                  { type: "button", name:  `${lclSurveyTwoId}`, text: `${lclSurveyTwoId}`, value: `${lclSurveyTwoId}` }
                ]
              }]
            };

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
    let survey =  msg.actions[0].value

    //get url endpoint
    let url = 'https://0www3cuk3j.execute-api.us-east-1.amazonaws.com/dev/surveys/'+survey

    //get request to get the survey
    axios.get(url)
      .then((response) => {
          try {
                const questions = response.data.questions
                var strBuilder = ''
                questions.forEach((question) => {

                  strBuilder = strBuilder + '\n' + question

                  }
                )
                var mans = {
                  text:strBuilder
                }
                bot.reply(mans)
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
