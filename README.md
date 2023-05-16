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

Mock data was initially used from kaggle to explore different NLPs for comparison (NLTK Vader, SIA, BERT, and RoBERTa); after preprocessing the mock data, front-end flask application was created.

Google Place API was used to gather a list of restaurants located in Melbourne CBD. A grid approach was used to bypass Google's API limit of 60 restaurants per call. Note that given the grid coordinates may overlap and produce duplicate restaurants, the output restaurant list would not be an exhaustive one. The starting coordinates for the bounding box of this grid are:
- North-east Boundary: (-37.805079, 144.973645) 
- South-west Boundary: (-37.820708, 144.954555) 

To collect the reviews, we utilised the [Google Map Reviews Scraper](https://github.com/gaspa93/googlemaps-scraper) created by [Mattia Gasparini](https://github.com/gaspa93).

Reviews collected were passed into the pre-trained and publicly available [cardiffnlp model](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment), a roBERTa-based model built by Cardiff University and trained originally on twitter posts.

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
