
const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);
    console.log(data)
    const params = {
        TableName: 'Recipes',
        Item: {
            id : uuid.v1(),
            recipeName: data.name,
            ingredients: data.ingredients
        }
    }
    
    dynamoDb.put(params,(error, result) => {
        if(error){
            console.log(error)
            callback(new Error('could not create'));
            return;
        }
        const response ={
            statusCode: 200,
            body: "Recipe saved to database"
        }
        callback(null,response);
    })
}

module.exports.list = (event, context, callback) => {
    const params = {
    TableName: 'Recipes'
    }
	dynamoDb.scan(params, (error, result) => {
     if(error){
     console.error(error);
     callback(new Error('could not fetch the recipes'));
     return;
     }
     const response = {
     statusCode: 200,
     body: JSON.stringify(result.Items)
     };
     callback(null,response);
	});
}

module.exports.get = (event, context, callback) => {
    const params = {
    TableName: 'Recipes',
    Key: {
    id: event.pathParameters.id
    }
    };
	dynamoDb.get(params, (error, result) => {
     if(error){
     console.error(error);
     callback(new Error('could not fetch the recipe'));
     return;
     }
     const response = {
     statusCode: 200,
     body: JSON.stringify(result.Item)
     };
     callback(null,response);
	});
}

module.exports.update = (event, context, callback) => {
const data = JSON.parse(event.body);
    const params = {
    TableName: 'Recipes',
    Item: {
    id: event.pathParameters.id,
    recipeName: data.name,
    ingredients: data.ingredients
    }
    };
	dynamoDb.put(params, (error, result) => {
     if(error){
     console.error(error);
     callback(new Error('could not update the recipe'));
     return;
     }
     const response = {
     statusCode: 200,
     body: "updated the recipe"
     };
     callback(null,response);
	});
}

module.exports.delete = (event, context, callback) => {
const params = {
    TableName: 'Recipes',
    Key: {
    id: event.pathParameters.id
    }
    };
	dynamoDb.delete(params, (error) => {
     if(error){
     console.error(error);
     callback(new Error('could not delete the recipe'));
     return;
     }
     const response = {
     statusCode: 200,
     body: "deleted the recipe"
     };
     callback(null,response);
	});
}

