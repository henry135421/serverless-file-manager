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
    // API calls last 24h
    const { data: apiCalls } = await supabase
      .from('analytics')
      .select('event_type, timestamp')
      .gte('timestamp', new Date(Date.now() - 86400000).toISOString());

    // Storage utilization
    const { data: storage } = await supabase
      .from('files')
      .select('file_size');
    
    const totalStorage = storage.reduce((sum, f) => sum + f.file_size, 0);

    // Most accessed files
    const { data: topFiles } = await supabase
      .from('analytics')
      .select('file_name, event_type')
      .eq('event_type', 'download')
      .limit(5);

    // Group by hour for chart
    const hourlyStats = apiCalls.reduce((acc, call) => {
      const hour = new Date(call.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        totalApiCalls: apiCalls.length,
        uploadCount: apiCalls.filter(c => c.event_type === 'upload').length,
        downloadCount: apiCalls.filter(c => c.event_type === 'download').length,
        totalStorage: totalStorage,
        bandwidthUsed: apiCalls.filter(c => c.event_type === 'download')
          .reduce((sum, c) => sum + (c.file_size || 0), 0),
        topFiles: topFiles,
        hourlyStats: hourlyStats
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};