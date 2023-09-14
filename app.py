from flask import app, render_template, request


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        pass
    return render_template('webpage.html')
