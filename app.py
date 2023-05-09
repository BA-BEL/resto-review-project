################################

#   Dependencies

# SQL ORM
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, funcfilter

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






############# FLASK SETUP & API ROUTES #############

#   Flask setup
app = Flask(__name__, static_folder = 'static')
app.config["JSON_SORT_KEYS"] = False


#   1 -- Home route
@app.route("/", methods = ["GET", "POST"])
def home():
    return render_template("index.html")

#   TEST ROUTE FOR POST METHODS
@app.route("/test", methods = ["GET", "POST"])
def test():
    return render_template("test.html")


############# INIT #############
webbrowser.open("http://127.0.0.1:8000/")

if __name__ == "__main__":
    app.run(debug=True, use_reloader = False, port=8000)