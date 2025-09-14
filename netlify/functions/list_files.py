import json
from datetime import datetime, timedelta

# Mock baza podataka - u produkciji koristiti pravu bazu
MOCK_FILES = [
    {
        'fileId': '1',
        'fileName': 'projekat-dokumentacija.pdf',
        'fileSize': 2500000,
        'contentType': 'application/pdf',
        'uploadDate': datetime.now().isoformat()
    },
    {
        'fileId': '2',
        'fileName': 'cloud-arhitektura.png',
        'fileSize': 1800000,
        'contentType': 'image/png',
        'uploadDate': (datetime.now() - timedelta(days=1)).isoformat()
    },
    {
        'fileId': '3',
        'fileName': 'serverless-prezentacija.pptx',
        'fileSize': 5200000,
        'contentType': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'uploadDate': (datetime.now() - timedelta(days=2)).isoformat()
    }
]

def handler(event, context):
    """
    Lista sve uploadovane fajlove
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
        # U produkciji bi ovde bio query ka bazi podataka
        # Za sada vraćamo mock podatke
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'files': MOCK_FILES,
                'totalCount': len(MOCK_FILES),
                'timestamp': datetime.now().isoformat()
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
                'error': 'Failed to fetch files',
                'details': str(e)
            })
        }