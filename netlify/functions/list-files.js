exports.handler = async (event, context) => {
  const mockFiles = [
    {
      fileId: "1",
      fileName: "test.pdf",
      fileSize: 2500000,
      uploadDate: new Date().toISOString()
    }
  ];

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ files: mockFiles })
  };
};