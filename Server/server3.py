from flask import Flask
from flask_socketio import SocketIO, emit
import json
import math


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@socketio.on('connect', namespace='/discount')
def handle_connect_discount():
    print('Connected to /discount')


@socketio.on('client_connected', namespace='/discount')
def handle_client_connected_discount(data):
    print('Connection Status: {}'.format(data['connected']))


@socketio.on('client_send', namespace='/discount')
def handle_client_send_discount(data):
    amount = data['amount']

    # Compute shipping fee
    discount = 0.33*amount

    # Emit result to client
    emit('server_send', json.dumps({
        'discount':discount
    }), namespace='/discount')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5003, debug='true')