from textblob import TextBlob
import re

def clean_text(text):
    ''' 
    Utility function to clean tweet text by removing links, special characters 
    using simple regex statements. 
    '''
    return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", text).split())


def find_sentiment(text):
    # create TextBlob object of passed tweet text
    analysis = TextBlob(clean_text(text))
    # set sentiment
    if analysis.sentiment.polarity > 0:
        return 'positive'
    elif analysis.sentiment.polarity == 0:
        return 'neutral'
    else:
        return 'negative'

def test_main():
    text = '''
    The titular threat of The Blob has always struck me as the ultimate movie
    monster: an insatiably hungry, amoeba-like mass able to penetrate
    virtually any safeguard, capable of--as a doomed doctor chillingly
    describes it--"assimilating flesh on contact.
    Snide comparisons to gelatin be damned, it's a concept with the most
    devastating of potential consequences, not unlike the grey goo scenario
    proposed by technological theorists fearful of
    artificial intelligence run rampant.
    '''

    blob = TextBlob(text)
    blob.tags           # [('The', 'DT'), ('titular', 'JJ'),
    #  ('threat', 'NN'), ('of', 'IN'), ...]

    blob.noun_phrases   # WordList(['titular threat', 'blob',
    #            'ultimate movie monster',
    #            'amoeba-like mass', ...])

    for sentence in blob.sentences:
        print(sentence.sentiment.polarity)
    # 0.060
    # -0.341

    blob.translate(to="es")  # 'La amenaza titular de The Blob...'


print(find_sentiment("Eat shit"))
