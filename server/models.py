from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import Schema, fields

from config import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String)
    image_url = db.Column(db.String, default='')
    bio = db.Column(db.String, default='')
    recipes = db.relationship('Recipe', back_populates='user', cascade='all, delete-orphan')

    @validates('username')
    def validate_username(self, key, value):
        if not isinstance(value, str) or not value.strip():
            raise ValueError('Username is required.')
        return value.strip()

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes are private.')

    @password_hash.setter
    def password_hash(self, password):
        if not isinstance(password, str) or not password:
            raise ValueError('Password is required.')
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        try:
            return bool(self._password_hash and isinstance(password, str) and
                        bcrypt.check_password_hash(self._password_hash, password))
        except ValueError:
            return False

class Recipe(db.Model):
    __tablename__ = 'recipes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    minutes_to_complete = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='recipes')

    @validates('title')
    def validate_title(self, key, value):
        if not isinstance(value, str) or not value.strip():
            raise ValueError('Title is required.')
        return value.strip()

    @validates('instructions')
    def validate_instructions(self, key, value):
        if not isinstance(value, str) or len(value.strip()) < 50:
            raise ValueError('Instructions must be at least 50 characters long.')
        return value

    @validates('minutes_to_complete')
    def validate_minutes(self, key, value):
        if isinstance(value, bool):
            raise ValueError('Cooking time must be a positive whole number.')
        try:
            minutes = int(value)
        except (TypeError, ValueError):
            raise ValueError('Cooking time must be a positive whole number.')
        if minutes <= 0 or str(minutes) != str(value):
            raise ValueError('Cooking time must be a positive whole number.')
        return minutes

class UserSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    image_url = fields.Str()
    bio = fields.Str()

class RecipeSchema(Schema):
    id = fields.Int()
    title = fields.Str()
    instructions = fields.Str()
    minutes_to_complete = fields.Int()
    user_id = fields.Int()
    user = fields.Nested(UserSchema)
