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

  //we need to get
  const question_one_text = data.question_one_text
  const callback_id = data.question_one_callback_id





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
      question_one_text:question_one_text,
      question_one_callback_id:callback_id,
      createdAt: timestamp,
      updatedAt: timestamp,
      team_id: data.team_id,
      question_creator: data.question_creator
    },
  };

  // write the todo to the database
  dynamodb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the todo item.'));
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
