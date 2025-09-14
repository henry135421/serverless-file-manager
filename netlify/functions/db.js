// Simulacija baze podataka
// NAPOMENA: Ovo je privremeno rešenje - u produkciji koristi pravu bazu

// Koristi global objekat da podatke prežive između poziva funkcija
// Ali će se resetovati kada se cold start desi
if (!global._fileDB) {
    global._fileDB = {
      files: [
        {
          fileId: "1",
          fileName: "example.pdf",
          fileSize: 2500000,
          contentType: "application/pdf",
          uploadDate: new Date().toISOString(),
          fileData: "JVBERi0xLjQKJeLjz9MKCg==" // Base64 dummy PDF
        },
        {
          fileId: "2",
          fileName: "dokument.docx",
          fileSize: 1250000,
          contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          uploadDate: new Date(Date.now() - 86400000).toISOString(), // Juče
          fileData: "UEsDBBQABgAIAAAAIQA="
        }
      ]
    };
  }
  
  const fileDatabase = {
    get files() {
      return global._fileDB.files;
    },
    
    addFile: function(file) {
      global._fileDB.files.push(file);
      return file;
    },
    
    getAllFiles: function() {
      return global._fileDB.files;
    },
    
    getFile: function(fileId) {
      return global._fileDB.files.find(f => f.fileId === fileId);
    },
    
    deleteFile: function(fileId) {
      const index = global._fileDB.files.findIndex(f => f.fileId === fileId);
      if (index > -1) {
        global._fileDB.files.splice(index, 1);
        return true;
      }
      return false;
    }
  };
  
  module.exports = fileDatabase;