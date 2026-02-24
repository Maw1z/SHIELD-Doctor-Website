import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from twilio.rest import Client

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Twilio Client
twilio_client = Client(
    os.getenv('TWILIO_ACCOUNT_SID'), 
    os.getenv('TWILIO_AUTH_TOKEN')
)

from app import routes