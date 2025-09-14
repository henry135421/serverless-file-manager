const db = require('./db');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fileName, fileSize, contentType, fileData } = JSON.parse(event.body);
    
    // Kreiraj novi fajl sa jedinstvenim ID
    const newFile = {
      fileId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fileName: fileName,
      fileSize: fileSize,
      contentType: contentType,
      uploadDate: new Date().toISOString(),
      fileData: fileData // Base64 encoded file content
    };
    
    // Dodaj u "bazu"
    db.addFile(newFile);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        fileId: newFile.fileId,
        message: `${fileName} successfully uploaded! Total files: ${db.files.length}`
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