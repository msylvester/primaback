'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB.DocumentClient()


AWS.config.update({
  region:"us-east-1",
  endpoint:"htts://dynamodb.us-east-1.amazonaws.com"

})

//var docClient = new AWS.DynamoDB.DocumentClient()
//const dynamodb = require('./dynamodb');

//here we are going to make a question which looks like

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
module.exports.create = (event, context, callback) => {

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const appointment = data.appointment
  const organizer = data.organizer
  const participant = data.participant
  const team_id = data.team_id


  //define my schema for users
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      appointment: appointment,
      createdAt: timestamp,
      organizer: organizer,
      participant: participant,
      updatedAt: timestamp,
      team_id: team_id
    },
  };

  // write the todo to the database
  dynamodb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the survey.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
