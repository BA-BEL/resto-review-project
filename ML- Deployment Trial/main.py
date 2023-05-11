from flask import Flask, render_template
from flask import Flask, jsonify, render_template, request


import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from string import punctuation
import re
from nltk.corpus import stopwords


app = Flask (__name__)

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/')
def my_form():
    return render_template('form.html')

@app.route('/', methods=['POST'])
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

if __name__ == "__main__":
    app.run(debug=True)