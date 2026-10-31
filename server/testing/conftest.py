#!/usr/bin/env python3
import os
import tempfile
import pytest

# The lab tests delete rows. Always use an isolated database, never preview data.
_test_directory = tempfile.TemporaryDirectory(prefix='reciplease-tests-')
os.environ['DATABASE_URL'] = 'sqlite:///' + _test_directory.name + '/test.db'


@pytest.fixture(scope='session', autouse=True)
def isolated_database():
    from app import app
    from models import db
    with app.app_context():
        db.create_all()
    yield
    with app.app_context():
        db.session.remove()
        db.engine.dispose()
    _test_directory.cleanup()

def pytest_itemcollected(item):
    par = item.parent.obj
    node = item.obj
    pref = par.__doc__.strip() if par.__doc__ else par.__class__.__name__
    suf = node.__doc__.strip() if node.__doc__ else node.__name__
    if pref or suf:
        item._nodeid = ' '.join((pref, suf))
