// Simulacija baze podataka u memoriji
// Ovo će deliti sve funkcije
const fileDatabase = {
    files: [
      {
        fileId: "1",
        fileName: "example.pdf",
        fileSize: 2500000,
        contentType: "application/pdf",
        uploadDate: new Date().toISOString(),
        fileData: "JVBERi0xLjQKJeLjz9MKCg==" // Base64 dummy PDF
      }
    ],
    
    addFile: function(file) {
      this.files.push(file);
      return file;
    },
    
    getAllFiles: function() {
      return this.files;
    },
    
    getFile: function(fileId) {
      return this.files.find(f => f.fileId === fileId);
    },
    
    deleteFile: function(fileId) {
      const index = this.files.findIndex(f => f.fileId === fileId);
      if (index > -1) {
        this.files.splice(index, 1);
        return true;
      }
      return false;
    }
  };
  
  module.exports = fileDatabase;