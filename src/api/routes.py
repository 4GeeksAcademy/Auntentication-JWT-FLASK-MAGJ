"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User
from api.utils import APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

api = Blueprint('api', __name__)
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json() or {}
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "email y password son requeridos"}), 400

    user = User(email=email, is_active=True)

    user.set_password(password)

    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Ese email ya está registrado"}), 409

    return jsonify(user.serialize()), 201


@api.route("/token", methods=["POST"])
def login():
    body = request.get_json() or {}
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "email y password son requeridos"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200


@api.route("/private", methods=["GET"])
@jwt_required()
def private():

    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no válido"}), 401

    return jsonify({
        "msg": "Acceso concedido",
        "user": user.serialize()
    }), 200
