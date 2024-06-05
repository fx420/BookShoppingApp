from flask import Flask
from flask_socketio import SocketIO, emit
import json
import math


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@socketio.on('connect', namespace='/shipping')
def handle_connect_shipping():
    print('Connected to /shipping')


@socketio.on('client_connected', namespace='/shipping')
def handle_client_connected_shipping(data):
    print('Connection Status: {}'.format(data['connected']))


@socketio.on('client_send', namespace='/shipping')
def handle_client_send_shipping(data):
    quantity = data['quantity']

    # Compute shipping fee
    shipping = 5*quantity

    # Emit result to client
    emit('server_send', json.dumps({
        'shipping':shipping
    }), namespace='/shipping')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug='true')