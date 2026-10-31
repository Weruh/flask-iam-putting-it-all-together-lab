#!/usr/bin/env python3

from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import User, Recipe, UserSchema, RecipeSchema

class Signup(Resource):
    def post(self):
        data = json_data()
        try:
            if data.get('password_confirmation', data.get('password')) != data.get('password'):
                raise ValueError('Passwords do not match.')
            if not all(isinstance(data.get(key, ''), str) for key in ('bio', 'image_url')):
                raise ValueError('Bio and image URL must be text.')
            user = User(username=data.get('username'), image_url=data.get('image_url', ''), bio=data.get('bio', ''))
            user.password_hash = data.get('password')
            db.session.add(user)
            db.session.commit()
        except (ValueError, IntegrityError) as exc:
            db.session.rollback()
            return {'errors': ['That username is already taken.' if isinstance(exc, IntegrityError) else str(exc)]}, 422
        session.clear()
        session['user_id'] = user.id
        return UserSchema().dump(user), 201

class CheckSession(Resource):
    def get(self):
        user = current_user()
        return (UserSchema().dump(user), 200) if user else unauthorized()

class Login(Resource):
    def post(self):
        data = json_data()
        if not isinstance(data.get('username'), str):
            return {'errors': ['Invalid username or password.']}, 401
        user = User.query.filter_by(username=data.get('username')).first()
        if not user or not user.authenticate(data.get('password')):
            return {'errors': ['Invalid username or password.']}, 401
        session.clear()
        session['user_id'] = user.id
        return UserSchema().dump(user), 200

class Logout(Resource):
    def delete(self):
        if not current_user():
            return unauthorized()
        session.clear()
        return '', 204

class RecipeIndex(Resource):
    def get(self):
        if not current_user():
            return unauthorized()
        return RecipeSchema(many=True).dump(Recipe.query.order_by(Recipe.id.desc()).all()), 200

    def post(self):
        user = current_user()
        if not user:
            return unauthorized()
        data = json_data()
        try:
            recipe = Recipe(title=data.get('title'), instructions=data.get('instructions'),
                            minutes_to_complete=data.get('minutes_to_complete'), user=user)
            db.session.add(recipe)
            db.session.commit()
        except (ValueError, IntegrityError) as exc:
            db.session.rollback()
            return {'errors': [str(exc) if isinstance(exc, ValueError) else 'Please complete every required field.']}, 422
        return RecipeSchema().dump(recipe), 201


def current_user():
    user_id = session.get('user_id')
    return db.session.get(User, user_id) if user_id else None


def unauthorized():
    return {'errors': ['Please log in to continue.']}, 401


def json_data():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(RecipeIndex, '/recipes', endpoint='recipes')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
