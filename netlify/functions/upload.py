import json
import base64
from datetime import datetime
import uuid

def handler(event, context):
    """
    Netlify Function handler za upload fajlova
    """
    # Proveri HTTP metodu
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request body
        body = json.loads(event['body'])
        file_name = body.get('fileName')
        file_size = body.get('fileSize')
        content_type = body.get('contentType')
        file_data = body.get('fileData')  # base64 encoded
        
        # Generiši unique ID
        file_id = str(uuid.uuid4())
        
        # Za demonstraciju, simuliramo čuvanje
        # U produkciji bi ovde bio kod za čuvanje na Cloudinary ili sličan servis
        upload_info = {
            'fileId': file_id,
            'fileName': file_name,
            'fileSize': file_size,
            'contentType': content_type,
            'uploadDate': datetime.now().isoformat(),
            'status': 'success'
        }
        
        print(f"File uploaded: {upload_info}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'success': True,
                'fileId': file_id,
                'message': f'File {file_name} uploaded successfully!'
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
                'error': 'Upload failed',
                'details': str(e)
            })
        }