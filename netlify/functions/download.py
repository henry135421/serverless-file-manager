import json
import base64
from datetime import datetime

def handler(event, context):
    """
    Generiše download link za fajl
    """
    # Proveri HTTP metodu
    if event['httpMethod'] != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Uzmi fileId iz query parametara
        query_params = event.get('queryStringParameters', {})
        file_id = query_params.get('fileId')
        
        if not file_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing fileId parameter'})
            }
        
        # Simulacija - u produkciji bi učitao pravi fajl
        mock_content = f"This is sample content for file {file_id}\nDownloaded at: {datetime.now()}"
        encoded_content = base64.b64encode(mock_content.encode()).decode()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'fileId': file_id,
                'fileName': f'file-{file_id}.txt',
                'fileData': f'data:text/plain;base64,{encoded_content}',
                'downloadUrl': f'/download/{file_id}'  # Simulirani URL
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Download failed',
                'details': str(e)
            })
        }