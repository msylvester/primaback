'use strict';

// const uuid = require('uuid');
const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB.DocumentClient()


AWS.config.update({
  region:"us-east-1",
  endpoint:"htts://dynamodb.us-east-1.amazonaws.com"

})

//var docClient = new AWS.DynamoDB.DocumentClient()
//const dynamodb = require('./dynamodb');

module.exports.create = (event, context, callback) => {

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

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
      id: data.id,
      email:data.email,
      password: getPass(),
      createdAt: timestamp,
      updatedAt: timestamp,
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

function getPass() {

  return "hello"

}
