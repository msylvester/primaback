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

 //  //we need to get
 //  var name_of_survey = data.name_of_survey
 //
 // name_of_survey = name_of_survey.replace(/\s+/g, '');

 //feedback should be passed a data key/value pair with sender, recipient, and question
 const question = data.question
 const sender = data.sender
 const recipient = data.recipient


  console.log(event)

  // if (typeof data.id !== 'string') {
  //   console.error('Validation Failed');
  //   callback(new Error('Couldn\'t create the todo item.'));
  //   return;
  // }

  // const params = {
  //   TableName: process.env.DYNAMODB_TABLE,
  //   Item: {
  //     id: uuid.v1(),
  //     text: data.text,
  //     checked: false,
  //     createdAt: timestamp,
  //     updatedAt: timestamp,
  //   },
  // };



  console.log(data)
  //define my schema for users
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      question: question,
      sender:sender,
      recipient:recipient,
      createdAt: timestamp,
      updatedAt: timestamp,
      team_id: data.team_id
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
