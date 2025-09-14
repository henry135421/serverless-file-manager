const db = require('./db');

exports.handler = async (event, context) => {
  try {
    const { fileId } = event.queryStringParameters || {};
    
    if (!fileId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing fileId parameter' })
      };
    }
    
    // Nađi fajl u "bazi"
    const file = db.getFile(fileId);
    
    if (!file) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'File not found' })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        fileName: file.fileName,
        fileData: file.fileData, // Base64 content
        contentType: file.contentType
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};