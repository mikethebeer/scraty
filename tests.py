import doctest
import os
import requests
import unittest
import sqlalchemy as sa
import json
from tornado_testing.layer import TornadoLayer, get_port_number
from crate.testing.layer import CrateLayer
from lovely.testlayers.layer import CascadedLayer
from sqlalchemy.orm import scoped_session, sessionmaker

from scraty.app import ScratyApplication


here = os.path.dirname(os.path.abspath(__file__))


class Session:
    def __init__(self, uri, session=None, method=None):
        self.uri = uri
        self.session = session or requests.session()
        self.method = method

    def __getattr__(self, attr):
        return Session(self.uri, self.session, attr)

    def __call__(self, *args, **kwargs):
        method = getattr(self.session, self.method)
        url = args[0]
        if url.startswith('/'):
            url = url[1:]
        url = '/'.join((self.uri, url))
        return method(url, **kwargs)


def printjson(s):
    if isinstance(s, bytes):
        s = s.decode('utf-8')
    if not s:
        print('None')
        return
    try:
        d = json.loads(s)
    except ValueError:
        print(s)
    else:
        print(json.dumps(d, indent=4, sort_keys=True))


def setup_layer():
    crate_path = os.path.join(here, 'parts/crate')
    crate_http_port = get_port_number()
    crate_transport_port = get_port_number()
    crate_layer = CrateLayer('crate',
                             crate_home=crate_path,
                             port=crate_http_port,
                             transport_port=crate_transport_port)
    engine = sa.create_engine('crate://localhost:' + str(crate_http_port))
    session = scoped_session(
        sessionmaker(autoflush=False, autocommit=False, bind=engine))
    tornado_layer = TornadoLayer(
        ScratyApplication(db_session=session, debug=True))
    return crate_layer, tornado_layer, engine


crate_layer, tornado_layer, engine = setup_layer()
test_layer = CascadedLayer('all', crate_layer, tornado_layer)


def setUp(test):
    # Base.metadata.create_all(bind=engine) foreign key error :(

    conn = engine.connect()
    conn.execute('''
create table stories (
    id string primary key,
    text string,
    link string
) with (number_of_replicas = 0)''')
    conn.execute('''
create table tasks (
    id string primary key,
    story_id string,
    text string,
    user string,
    user_id string
) with (number_of_replicas = 0)''')

    def refresh(table):
        conn.execute('refresh table {table}'.format(table=table))

    test.globs['client'] = Session(tornado_layer.uri)
    test.globs['p'] = printjson
    test.globs['json'] = json
    test.globs['refresh'] = refresh


def tearDown(test):
    pass


def test_suite():
    flags = (doctest.NORMALIZE_WHITESPACE | doctest.ELLIPSIS)
    suite = unittest.TestSuite()
    s = doctest.DocFileSuite(
        'docs/story.rst', setUp=setUp, tearDown=tearDown, optionflags=flags)
    s.layer = test_layer
    suite.addTest(s)
    return suite
