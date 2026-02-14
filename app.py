from flask import Flask, render_template
import yaml
import argparse, sys

app = Flask(__name__)

@app.route('/')
def index():
    with open("services.yml", 'r') as server_content:
        return render_template('index.html', yaml= yaml.safe_load(server_content))

if __name__ == '__main__':
    parser=argparse.ArgumentParser()

    parser.add_argument("--port", help="Port to run on, default 5000", default=5000)
    parser.add_argument("--debug", help="enable debug logs, default False",default=False)

    args=parser.parse_args()
    try:
        port = int(args.port)
    except ValueError:
        print("Invalid port number. Please provide an integer value for the port.")
        sys.exit(1)
    
    try:
        debug = bool(args.debug)
    except ValueError:
        print("Invalid debug value. Please provide a boolean value (True/False) for debug.")
        sys.exit(1)

    app.run(host='0.0.0.0', port=args.get(), debug=True)

