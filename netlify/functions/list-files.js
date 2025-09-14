// Ista lista kao u upload.js
let mockFiles = [
  {
    fileId: "1",
    fileName: "test.pdf",
    fileSize: 2500000,
    contentType: "application/pdf",
    uploadDate: new Date().toISOString()
  }
];

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      files: mockFiles,
      totalCount: mockFiles.length 
    })
  };
};