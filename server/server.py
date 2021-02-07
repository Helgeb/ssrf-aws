
import json

import requests
from flask import Flask, Response, request

app = Flask(__name__)


@app.route('/url', methods=['POST'])
def get_url():
    url = request.json["url"]
    resp = requests.request(method="GET", url=url)
    response = Response(resp.content, resp.status_code, [])
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
