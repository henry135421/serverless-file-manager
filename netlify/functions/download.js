exports.handler = async (event, context) => {
    const { fileId } = event.queryStringParameters || {};
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        fileData: 'data:text/plain;base64,VGVzdCBmYWpsIHNhZHLFvmFqIQ==',
        fileName: 'test.txt'
      })
    };
  };