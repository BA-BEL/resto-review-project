# resto-review-project
### DABC Project 4 for Monash Data Analytics Bootcamp
##### Johnny Truong, Josh Brodrick, Dominique Dela Cruz, Bilal 'Bel' Abdul Hak
--- 

## Project Outline:

### Restaurant Revolution

![alt_restaurant_pic](https://cdn-icons-png.flaticon.com/512/4719/4719277.png)

This project focused on creating an alternative to the conventional '5-star' rating system using a natural language processing (NLP) model to classify text reviews with the sentiments of positive, neutral, or negative.

Below are the tools used for this project pipeline:

- Python (Jupyter Notebook, Flask, SQLAlchemy, Pandas, RoBERTa)
- SQLite
- HTML
- CSS
- JavaScript

Mock data was initially used from kaggle to explore different NLPs for comparison (NLTK Vader, SIA, BERT, and RoBERTa); after preprocessing the mock data, front-end flask application was creating.
When real review data was scraped, it was a simple change of API endpoints and JSON D3 syntax to adjust to the real data.


---
## File and code usage

- Navigate to the the directory where the repository is located

- Activate the virtual environment with the python dependencies installed (For DABC assessors, running `conda activate PythonData` will suffice)

- Finally, run `python app.py` and the Flask API will initialize and the home page will open up

### Python Dependencies and JavaScript LIbraries

#### Python:

- SQLAlchemy
- sqlite3
- Pandas
- Flask
- re
- transformers
- tqdm

#### JavaScript:

- D3
- Leaflet
- ApexCharts