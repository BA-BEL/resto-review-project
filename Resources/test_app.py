################################

#   Dependencies

# SQL ORM
import sqlalchemy
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, funcfilter, func, inspect

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
engine = create_engine("sqlite:///data/restaurant_db.sqlite")
Base = automap_base()
Base.prepare(engine, reflect = True)

#   Store tables into variables
data = Base.classes.keys()

reviews = Base.classes.reviews_agg
details = Base.classes.restaurants



############# FLASK SETUP & API ROUTES #############

#   Flask setup
app = Flask(__name__, static_folder = 'static')
app.config["JSON_SORT_KEYS"] = False


# #   1 -- Home route
# @app.route("/", methods = ["GET", "POST"])
# def home():
#     return render_template("index.html")



#   TEST ROUTE FOR JSON REVIEW
@app.route("/api/v1.0/stats", methods = ["GET"])
def jsonref():
    
    session = Session(engine)

    scores = session.query(reviews.name,
                        reviews.restaurant_ids,
                        reviews.cuisine,
                        reviews.total,
                        reviews.positive_count,
                        reviews.neutral_count,
                        reviews.negative_count,
                        reviews.positive_percentage,
                        reviews.neutral_percentage,
                        reviews.negative_percentage
    )

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
        data['latitude'] = str(restaurant.lat).replace('(','').replace(')',''),
        data['longitude'] = str(restaurant.long).replace('}','')
    
        json_list.append(data)
    
        response = jsonify(json_list)
        response.headers.add("Access-Control-Allow-Origin", "*")

        session.close()

        return response

############# INIT #############
webbrowser.open("http://127.0.0.1:8000/")

if __name__ == "__main__":
    app.run(debug=True, use_reloader = False, port=8000)