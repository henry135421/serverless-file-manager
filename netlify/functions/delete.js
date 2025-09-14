exports.handler = async (event, context) => {
    if (event.httpMethod !== 'DELETE') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'File deleted successfully'
      })
    };
  };
  