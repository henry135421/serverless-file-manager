// netlify/functions/upload.js
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
    
    // Debug Cloudinary config
    console.log('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
      cloud_name_value: process.env.CLOUDINARY_CLOUD_NAME
    });
    
    console.log('Upload attempt:', { fileName, fileSize, willUseCloudinary: fileSize > 100000 });
    
    let fileUrl = fileData;
    let cloudinaryUsed = false;
    
    // Za veće fajlove koristi Cloudinary
    if (fileSize > 100000) { // 100KB
      try {
        console.log('Attempting Cloudinary upload...');
        
        const uploadResult = await cloudinary.uploader.upload(fileData, {
          resource_type: 'auto',
          folder: 'serverless-file-manager',
          public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
          overwrite: true,
          timeout: 60000 // 60 sekundi timeout
        });
        
        fileUrl = uploadResult.secure_url;
        cloudinaryUsed = true;
        console.log('Cloudinary upload SUCCESS:', {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary upload FAILED:', {
          error: cloudinaryError.message,
          details: cloudinaryError
        });
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

    console.log('Database insert successful:', {
      id: data.id,
      cloudinary: cloudinaryUsed
    });

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
        cloudStorage: cloudinaryUsed,
        storageType: cloudinaryUsed ? 'Cloudinary' : 'Supabase Base64'
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