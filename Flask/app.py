from flask import Flask,render_template,redirect,jsonify,url_for,request
import sys

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/settings')
def settings():
	return render_template('settings.html')

@app.route('/respuesta',methods=["POST"])
def respuesta():
	nombre = request.form['txt_name']
	apellido = request.form['txt_last']

	dic = {
		"name": nombre,
		"lastname": apellido
	}

	return jsonify(dic)

if __name__ == '__main__':
	app.run(debug=True)
