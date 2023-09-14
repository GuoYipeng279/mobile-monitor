from flask import Flask, app, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        pass
    return render_template('index.html')

@app.route('/start_recording', methods=['GET', 'POST'])
def start_recording():
    if request.method == 'POST':
        pass
    return render_template('index.html')