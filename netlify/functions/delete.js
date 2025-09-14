const db = require('./db');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const { fileId } = event.queryStringParameters || {};
    
    if (!fileId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing fileId parameter' })
      };
    }
    
    // Obriši iz "baze"
    const deleted = db.deleteFile(fileId);
    
    if (!deleted) {
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
        success: true,
        message: 'File deleted successfully',
        remainingFiles: db.files.length
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