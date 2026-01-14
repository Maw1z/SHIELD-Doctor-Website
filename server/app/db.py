import os
import psycopg2
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

def get_db_connection():
    """
    Establishes a connection to the Neon PostgreSQL database.
    """
    try:
        url = os.getenv("DATABASE_URL")
        connection = psycopg2.connect(url)
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None
