from flask import Flask, render_template, request
from transformers import pipeline


app = Flask(__name__)

@app.route('/roberta', methods=['GET', 'POST'])
def roberta():
    if request.method == 'POST':
        review = request.form['review']

        # Load the pre-trained ROBERTA sentiment analysis model
        model = pipeline('sentiment-analysis', model='roberta-base')

        # Analyze the sentiment of the review
        results = model(review)

        # Get the sentiment with the highest score
        highest_sentiment = results[0]['label']

        # Get the scores for all sentiments
        scores = {sent['label']: sent['score'] for sent in results}

        # Assign scores based on sentiment
        positive_score = scores.get('POSITIVE', 0.0)
        neutral_score = scores.get('NEUTRAL', 0.0)
        negative_score = scores.get('NEGATIVE', 0.0)

        return render_template('result.html', sentiment=highest_sentiment, positive_score=positive_score,
                               neutral_score=neutral_score, negative_score=negative_score, review=review)

    return render_template('roberta.html')

if __name__ == '__main__':
    app.run(debug=True)