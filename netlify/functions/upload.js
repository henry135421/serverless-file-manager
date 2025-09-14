const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Konfiguracija Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Cloudinary config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
  });

exports.handler = async (event, context) => {
  // Dozvoli CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fileName, fileSize, contentType, fileData } = JSON.parse(event.body);
    
    console.log('Upload started:', { fileName, fileSize, contentType });
    
    let fileUrl = fileData; // Default za male fajlove
    
    // Za veće fajlove koristi Cloudinary
    if (fileSize > 100000) { // 100KB
      try {
        // Upload na Cloudinary
        const uploadResult = await cloudinary.uploader.upload(fileData, {
          resource_type: 'auto',
          folder: 'serverless-file-manager',
          public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
          overwrite: true
        });
        
        fileUrl = uploadResult.secure_url;
        console.log('Cloudinary upload successful:', uploadResult.public_id);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        // Nastavi sa base64 ako Cloudinary ne radi
      }
    }
    
    // Sačuvaj metadata u Supabase
    const { data, error } = await supabase
      .from('files')
      .insert({
        file_name: fileName,
        file_size: fileSize,
        content_type: contentType,
        file_url: fileUrl
      })
      .select()
      .single();

    if (error) throw error;

    console.log('Database insert successful:', data.id);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        fileId: data.id,
        message: `${fileName} successfully uploaded!`,
        cloudStorage: fileUrl.includes('cloudinary')
      })
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};