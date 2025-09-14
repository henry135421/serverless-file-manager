// Globalna lista fajlova (simulacija baze)
let mockFiles = [];

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { fileName, fileSize, contentType, fileData } = JSON.parse(event.body);
  
  // Dodaj novi fajl u listu
  const newFile = {
    fileId: Date.now().toString(),
    fileName: fileName,
    fileSize: fileSize,
    contentType: contentType,
    uploadDate: new Date().toISOString()
  };
  
  mockFiles.push(newFile);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      fileId: newFile.fileId,
      message: `${fileName} uploaded!`
    })
  };
};