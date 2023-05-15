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

engine1 = create_engine("sqlite:///data/restaurant_db.sqlite")
Base1 = automap_base()
Base1.prepare(engine1, reflect = True)

#   Store tables into variables
data = Base1.classes.keys()

reviews = Base1.classes.reviews_agg
details = Base1.classes.restaurants



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
def mock_cuisines():
    
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

#   TEST ROUTE FOR JSON STATS
@app.route("/stats_response", methods = ["GET"])
def stats():
    
    session = Session(engine1)

    scores = session.query(reviews.name,
                        reviews.restaurant_ids,
                        reviews.cuisine,
                        reviews.total,
                        reviews.positive_count,
                        reviews.neutral_count,
                        reviews.negative_count,
                        reviews.positive_percentage,
                        reviews.neutral_percentage,
                        reviews.negative_percentage)

    json_list = []

    for item in scores:

        data = {}

        data['name'] = item[0]
        data['restaurant_ids'] = item[1]
        data['cuisine'] = item[2]
        data['total'] = item[3]
        data['positive_count'] = item[4]
        data['neutral_count'] = item[5]
        data['negative_count'] = item[6] 
        data['positive_percentage'] = item[7]
        data['neutral_percentage'] = item[8]
        data['negative_percentage'] = item[9]

        
        restaurant = session.query(details).get(item[1])

        # assign the values from the restaurant object to the dictionary
        data['price_level'] = str(restaurant.price_level).replace('(','').replace(')',''),
        data['address'] = restaurant.address.replace("')",''),
        data['latitude'] = str(restaurant.lat).replace('[','').replace(']',''),
        data['longitude'] = str(restaurant.long).replace('[','')
    
        json_list.append(data)
    
    response = jsonify(json_list)
    response.headers.add("Access-Control-Allow-Origin", "*")

    session.close()
    
    return response


#   DATA ENDPOINT FOR CUISINES (i.e. unique)
@app.route("/stats_response/cuisines")
def cuisines():
    
    #   Start session
    session = Session(engine1)

    #   Query assignment
    query = session.query(reviews.cuisine, 
                               func.count(reviews.restaurant_ids)).group_by(reviews.cuisine)

    #   Declare list
    cuisine_dict_list = []

    #   Iterate through query
    for cuis in query:

        # Declare dictionary that will be appended to above list
        cuisine_dict = {}

        # Assign..
        cuisine_dict["cuisine"] = cuis[0]
        cuisine_dict["count"] = cuis[1]
   

        cuisine_dict_list.append(cuisine_dict)
    
    response = jsonify(cuisine_dict_list)
    response.headers.add("Access-Control-Allow-Origin", "*")

    session.close()

    return response

@app.route("/stats", methods = ["GET", "POST"])
def map():
    return render_template("stats.html")


############# INIT #############
webbrowser.open("http://127.0.0.1:8000/")

if __name__ == "__main__":
    app.run(debug=True, use_reloader = False, port=8000)