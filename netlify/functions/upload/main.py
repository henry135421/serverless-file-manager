import json
import cloudinary
import cloudinary.uploader
from datetime import datetime
import os

# Cloudinary config
cloudinary.config(
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key = os.environ.get('CLOUDINARY_API_KEY'),
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')
)

def handler(event, context):
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
        body = json.loads(event['body'])
        file_name = body.get('fileName')
        file_data = body.get('fileData')  # base64
        
        # Upload na Cloudinary
        result = cloudinary.uploader.upload(
            file_data,
            public_id=f"file-manager/{file_name}",
            resource_type="auto"
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'fileId': result['public_id'],
                'url': result['secure_url'],
                'message': f'{file_name} uploaded successfully!'
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