import sqlite3
import pandas as pd
import os 


conn = sqlite3.connect('restaurant_db.sqlite')
c = conn.cursor()

reviews_df = pd.read_csv(os.path.join("output", "reviews_scores.csv"),header=0)
restaurants_df = pd.read_csv(os.path.join("output", "restaurants.csv"),header=0)



c.execute('DROP table IF EXISTS reviews')
c.execute('DROP table IF EXISTS restaurants')

c.execute(''' CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY,
        roberta_neg REAL,
        roberta_neu REAL,
        roberta_pos REAL,
        output TEXT,
        restaurant_ids INT,
        id_review TEXT,
        caption TEXT,
        relative_date TEXT,
        username TEXT,
        name TEXT,
        cuisine TEXT
)''')

c.execute(''' CREATE TABLE IF NOT EXISTS restaurants (
        restaurant_id INTEGER PRIMARY KEY,
        name TEXT,
        place_id TEXT,
        price_level INT,
        lat REAL,
        long REAL,
        types TEXT,
        address TEXT,
        cuisine TEXT
)''')


reviews_df.to_sql('reviews', con=conn, if_exists='append', index=False)
restaurants_df.to_sql('restaurants', con=conn, if_exists='append', index=False)

c.execute("SELECT COUNT(*) FROM reviews")
print("reviews table row count:", c.fetchone()[0])

c.execute("SELECT COUNT(*) FROM restaurants")
print("restaurants table row count:", c.fetchone()[0])

conn.commit()

conn.close()