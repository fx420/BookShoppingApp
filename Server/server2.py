from flask import Flask
from flask_socketio import SocketIO, emit
import json
import math


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@socketio.on('connect', namespace='/fee')
def handle_connect_fee():
    print('Connected to /fee')


@socketio.on('client_connected', namespace='/fee')
def handle_client_connected_fee(data):
    print('Connection Status: {}'.format(data['connected']))


@socketio.on('client_send', namespace='/fee')
def handle_client_send_fee(data):
    quantity = data['quantity']

    # Compute shipping fee
    fee = 1*quantity

    # Emit result to client
    emit('server_send', json.dumps({
        'fee':fee
    }), namespace='/fee')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5002, debug='true')