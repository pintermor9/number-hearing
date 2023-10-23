from flask import Flask
app = Flask('app', static_url_path='', static_folder='')
app.run(host='0.0.0.0', port=8080)