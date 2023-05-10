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
                               func.avg(mock.vader_compound)).group_by(mock.restaurant_id)

    #   Declare list
    mock_dict_list = []

    #   Iterate through query
    for avg in mock_query:

        # Declare dictionary that will be appended to above list
        mock_dict = {}

        # Assign..
        mock_dict["id"] = avg[0]
        mock_dict["vader_compound"] = avg[1]
   

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



############# INIT #############
webbrowser.open("http://127.0.0.1:8000/")

if __name__ == "__main__":
    app.run(debug=True, use_reloader = False, port=8000)