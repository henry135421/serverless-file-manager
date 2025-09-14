const db = require('./db');

exports.handler = async (event, context) => {
  try {
    // Dobavi sve fajlove iz "baze"
    const files = db.getAllFiles();
    
    // Sortiraj po datumu (najnoviji prvi)
    const sortedFiles = files.sort((a, b) => 
      new Date(b.uploadDate) - new Date(a.uploadDate)
    );
    
    // Vrati bez fileData da response bude manji
    const filesWithoutData = sortedFiles.map(({ fileData, ...file }) => file);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        files: filesWithoutData,
        totalCount: files.length,
        totalSize: files.reduce((sum, f) => sum + f.fileSize, 0)
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