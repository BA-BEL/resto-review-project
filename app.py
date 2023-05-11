################################

#   Dependencies

# SQL ORM
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, funcfilter, func

# Flask API requisites
import requests
import webbrowser
from flask import   Flask,              \
                    url_for,            \
                    jsonify,            \
                    render_template,    \
                    request,            \
                    abort,              \
                    make_response,      \
                    redirect

#   Dom machine learning deps
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from string import punctuation
import re
from nltk.corpus import stopwords



############# DATABASE SETUP #############

#   reviews.db setup
engine = create_engine("sqlite:///data/reviews.sqlite")
Base = automap_base()
Base.prepare(engine, reflect = True)

#   Store tables into variables
mock = Base.classes.mock




############# FLASK SETUP & API ROUTES #############

#   Flask setup
app = Flask(__name__, static_folder = 'static')
app.config["JSON_SORT_KEYS"] = False


#   1 -- Home route
@app.route("/", methods = ["GET", "POST"])
def home():
    return render_template("index.html")



#   TEST ROUTE FOR JSON REVIEW
@app.route("/api/v1.0/jsonrefresher", methods = ["GET"])
def jsonref():
    
    #   Start session
    session = Session(engine)

    #   Query assignment
    mock_query = session.query(mock.id, 
                               mock.vader_neg, 
                               mock.vader_neu,
                               mock.vader_pos,
                               mock.vader_compound,
                               mock.roberta_neg,
                               mock.roberta_neu,
                               mock.roberta_pos,
                               mock.review,
                               mock.liked,
                               mock.sentiment,
                               mock.cuisine,
                               mock.restaurant_id)

    #   Declare list
    mock_dict_list = []

    #   Iterate through query
    for review in mock_query:

        # Declare dictionary that will be appended to above list
        mock_dict = {}

        # Assign..
        mock_dict["id"] = review[0]
        mock_dict["vader_neg"] = review[1]
        mock_dict["vader_neu"] = review[2]
        mock_dict["vader_pos"] = review[3]
        mock_dict["vader_compound"] = review[4]
        mock_dict["roberta_neg"] = review[5]
        mock_dict["roberta_neu"] = review[6]
        mock_dict["roberta_pos"] = review[7]
        mock_dict["review"] = review[8]
        mock_dict["liked"] = review[9]
        mock_dict["sentiment"] = review[10]
        mock_dict["cuisine"] = review[11]
        mock_dict["retaurant_id"] = review[12]

        mock_dict_list.append(mock_dict)
    
    response = jsonify(mock_dict_list)
    response.headers.add("Access-Control-Allow-Origin", "*")

    session.close()

    return response


#   TEST ROUTE FOR JSON REVIEW AGGREGATION
@app.route("/api/v1.0/jsonrefresher/agg", methods = ["GET"])
def jsonagg():
    
    #   Start session
    session = Session(engine)

    #   Query assignment
    mock_query = session.query(mock.restaurant_id, 
                               mock.cuisine,
                               func.avg(mock.vader_compound),
                               func.sum(mock.vader_pos),
                               func.sum(mock.vader_neu),
                               func.sum(mock.vader_neg),
                               ).group_by(mock.restaurant_id)

    #   Declare list
    mock_dict_list = []

    #   Iterate through query
    for avg in mock_query:

        # Declare dictionary that will be appended to above list
        mock_dict = {}

        # Assign..
        mock_dict["id"] = avg[0]
        mock_dict["cuisine"] = avg[1]
        mock_dict["vader_compound"] = avg[2]
        mock_dict["vader_pos"] = avg[3]
        mock_dict["vader_neu"] = avg[4]
        mock_dict["vader_neg"] = avg[5]
   

        mock_dict_list.append(mock_dict)
    
    response = jsonify(mock_dict_list)
    response.headers.add("Access-Control-Allow-Origin", "*")

    session.close()

    return response


#   MOCK DATA ENDPOINT FOR CUISINES (i.e. unique)
@app.route("/api/v1.0/jsonrefresher/cuisines")
def cuisines():
    
    #   Start session
    session = Session(engine)

    #   Query assignment
    mock_query = session.query(mock.cuisine, 
                               func.count(mock.id)).group_by(mock.cuisine)

    #   Declare list
    mock_dict_list = []

    #   Iterate through query
    for avg in mock_query:

        # Declare dictionary that will be appended to above list
        mock_dict = {}

        # Assign..
        mock_dict["cuisine"] = avg[0]
        mock_dict["count"] = avg[1]
   

        mock_dict_list.append(mock_dict)
    
    response = jsonify(mock_dict_list)
    response.headers.add("Access-Control-Allow-Origin", "*")

    session.close()

    return response


#   TEST ROUTE FOR POST METHODS
@app.route("/test", methods = ["GET", "POST"])
def test():
    return render_template("test.html")

#####   DOM ROUTES

@app.route('/dom')
def dom():
    return render_template('home.html')

@app.route('/form')
def my_form():
    return render_template('form.html')

@app.route('/form', methods=['POST'])
def my_form_post():
    stop_words = stopwords.words('english')
    
    #convert to lowercase
    text1 = request.form['text1'].lower()
    
    text_final = ''.join(c for c in text1 if not c.isdigit())
    
    #remove punctuations
    #text3 = ''.join(c for c in text2 if c not in punctuation)
        
    #remove stopwords    
    processed_doc1 = ' '.join([word for word in text_final.split() if word not in stop_words])

    sa = SentimentIntensityAnalyzer()
    dd = sa.polarity_scores(text=processed_doc1)
    compound = round((1 + dd['compound'])/2, 2)

    return render_template('form.html', final=compound, text1=text_final,text2=dd['pos'],text5=dd['neg'],text4=compound,text3=dd['neu'])


@app.route('/input-nltk-vader', methods=["GET", "POST"])
def vader():
    if request.method == "POST":
        inp = request.form.get("inp")
        sia = SentimentIntensityAnalyzer()
        score = sia.polarity_scores(inp)

        if score["neg"] != 0:
            return render_template ('input_vader.html', message= "Negative 😵😵")
        else:
            return render_template('input_vader.html', message="Positive 🙂🙂")
        
    return render_template('input_vader.html')



############# INIT #############
webbrowser.open("http://127.0.0.1:8000/")

if __name__ == "__main__":
    app.run(debug=True, use_reloader = False, port=8000)