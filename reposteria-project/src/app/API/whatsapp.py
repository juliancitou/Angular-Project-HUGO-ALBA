from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "API de WhatsApp funcionando!"})

@app.route('/api/whatsapp', methods=['POST'])
def whatsapp_webhook():
    return jsonify({"status": "webhook recibido"})

if __name__ == '__main__':
    app.run(debug=True)