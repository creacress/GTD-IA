import sqlite3
import os
import pandas as pd

DB_PATH = 'public/database/gtd.db'  # update this path if needed
EXPORT_FOLDER = 'exports'

os.makedirs(EXPORT_FOLDER, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Récupérer toutes les tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

for table_name in tables:
    table_name = table_name[0]
    print(f"Exporting table: {table_name}")
    df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
    export_path = os.path.join(EXPORT_FOLDER, f"{table_name}.csv")
    df.to_csv(export_path, index=False)

print("✅ Export terminé")
conn.close()
