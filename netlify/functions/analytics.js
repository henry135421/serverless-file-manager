const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { data: apiCalls } = await supabase
      .from('analytics')
      .select('event_type, timestamp, file_size, file_name');

    const { data: storage } = await supabase
      .from('files')
      .select('file_size');
    
    const totalStorage = storage ? storage.reduce((sum, f) => sum + (f.file_size || 0), 0) : 0;

    const downloadCounts = {};
    apiCalls?.filter(c => c.event_type === 'download').forEach(call => {
      const fileName = call.file_name;
      downloadCounts[fileName] = (downloadCounts[fileName] || 0) + 1;
    });

    const topFiles = Object.entries(downloadCounts)
      .map(([file_name, count]) => ({ file_name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        totalApiCalls: apiCalls?.length || 0,
        uploadCount: apiCalls?.filter(c => c.event_type === 'upload').length || 0,
        downloadCount: apiCalls?.filter(c => c.event_type === 'download').length || 0,
        totalStorage: totalStorage,
        bandwidthUsed: apiCalls?.filter(c => c.event_type === 'download')
          .reduce((sum, c) => sum + (c.file_size || 0), 0) || 0,
        topFiles: topFiles
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