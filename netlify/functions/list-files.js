const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
  // Dozvoli CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    };
  }

  try {
    // Dobavi sve fajlove iz baze
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) throw error;

    // Mapiraj na format koji očekuje frontend ALI BEZ fileData
    const mappedFiles = (files || []).map(file => ({
      fileId: file.id,
      fileName: file.file_name,
      fileSize: file.file_size,
      contentType: file.content_type,
      uploadDate: file.upload_date,
      // NE VRAĆAJ fileData ovde - samo u download funkciji!
      // fileData: file.file_url  // UKLONI OVO
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        files: mappedFiles,
        totalCount: mappedFiles.length,
        totalSize: mappedFiles.reduce((sum, f) => sum + (f.fileSize || 0), 0)
      })
    };
  } catch (error) {
    console.error('List error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};