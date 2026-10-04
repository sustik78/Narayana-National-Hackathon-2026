import sqlite3
import os
from datetime import datetime, timezone
from app.config import settings

DB_FILE = "sach_ai.db"

def init_db():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                detected_lang TEXT NOT NULL,
                red_flags_count INTEGER NOT NULL,
                source_type TEXT
            )
        ''')
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database initialization warning: {e}")

def log_analysis_event(risk_level: str, risk_score: int, detected_lang: str, red_flags_count: int, source_type: str = "text"):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO audit_logs (timestamp, risk_level, risk_score, detected_lang, red_flags_count, source_type)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (datetime.now(timezone.utc).isoformat(), risk_level, risk_score, detected_lang, red_flags_count, source_type))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Audit log warning: {e}")
