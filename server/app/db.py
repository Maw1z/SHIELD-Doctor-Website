import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    try:
        connection = psycopg2.connect(host=os.getenv("PGHOST"), 
                                    port=os.getenv("PGPORT"), 
                                    database=os.getenv("PGDATABASE"), 
                                    user=os.getenv("PGUSER"), 
                                    password=os.getenv("PGPASSWORD") )
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None
