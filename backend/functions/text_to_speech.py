import requests
from decouple import config

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

# Eleven Labs
# Convert text to speech

def convert_text_to_speech(message):
    # Define data (body)
    body = {
        "text": message,
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0
        }
    }

    # Define voice
    voice_rachel = "21m00Tcm4TlvDq8ikWAM"

    # Constructing headers and endpoints
    headers = { "xi-api-key": ELEVEN_LABS_API_KEY, "Content-Type": "application/json", "accept": "audio/mpeg"}
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_rachel}"

    # Send Request
    try:
        response = requests.post(endpoint, json=body, headers=headers)
    except Exception as e:
        return
    
    # Handle Response
    if response.status_code == 200:
        return response.content
    else:
        return