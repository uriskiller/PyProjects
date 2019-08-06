from flask import Flask,render_template,redirect,jsonify,url_for
import sys

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/respuesta')
def respuesta():
	dic = {
		"name": "Jose",
		"lastname": "Perez"
	}

	return jsonify(dic)

if __name__ == '__main__':
	app.run(debug=True)