from flask import Flask, render_template
import yaml
app = Flask(__name__)

@app.route('/')
def index():
    with open("services.yml", 'r') as server_content:
        return render_template('index.html', yaml= yaml.safe_load(server_content))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
