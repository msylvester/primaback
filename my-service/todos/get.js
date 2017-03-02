'use strict';

const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB.DocumentClient()


module.exports.get = (event, context, callback) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch user info
  dynamodb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the todo item.'));
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
