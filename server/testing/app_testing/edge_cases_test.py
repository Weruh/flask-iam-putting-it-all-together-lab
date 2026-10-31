"""Security and input boundaries beyond the original lab scenarios."""
import pytest
from app import app


def test_recipe_requires_a_session():
    with app.test_client() as client:
        response = client.post('/recipes', json={'title': 'Private draft'})
        assert response.status_code == 401
        assert isinstance(response.json['errors'], list)


def test_recipe_owner_is_session_user_and_passwords_are_private():
    with app.test_client() as client:
        signup = client.post('/signup', json={'username': 'ownership-test', 'password': 'test-password'})
        assert signup.status_code == 201
        assert 'password_hash' not in signup.json
        assert '_password_hash' not in signup.json
        response = client.post('/recipes', json={
            'title': 'A recipe with the right owner',
            'instructions': 'Chop the vegetables finely and gently simmer until tender. Serve warm.',
            'minutes_to_complete': 25,
            'user_id': 99999,
        })
        assert response.status_code == 201
        assert response.json['user_id'] == signup.json['id']
        assert '_password_hash' not in response.json['user']
        assert client.get('/check_session').json['id'] == signup.json['id']
        assert client.delete('/logout').status_code == 204
        assert client.get('/recipes').status_code == 401


@pytest.mark.parametrize('payload', [[], {'username': ['invalid']}, None])
def test_malformed_auth_input_is_not_a_server_error(payload):
    with app.test_client() as client:
        assert client.post('/signup', json=payload).status_code == 422
        assert client.post('/login', json=payload).status_code == 401


def test_duplicate_signup_and_password_confirmation():
    with app.test_client() as client:
        data = {'username': 'duplicate-test', 'password': 'secret'}
        assert client.post('/signup', json=data).status_code == 201
        assert client.post('/signup', json=data).status_code == 422
        data.update(username='confirmation-test', password_confirmation='different')
        assert client.post('/signup', json=data).status_code == 422


@pytest.mark.parametrize('minutes', [0, -2, 1.5, True, 'not a time', None])
def test_invalid_recipe_time_is_rejected(minutes):
    with app.test_client() as client:
        username = 'time-test-' + str(minutes)
        client.post('/signup', json={'username': username, 'password': 'secret'})
        response = client.post('/recipes', json={
            'title': 'Invalid cooking time',
            'instructions': 'Toast the spices, add the vegetables and cook until tender. Serve warm.',
            'minutes_to_complete': minutes,
        })
        assert response.status_code == 422
