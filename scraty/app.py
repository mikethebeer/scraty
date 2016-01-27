
import sys
import logging
import os
from os.path import dirname
from tornado.web import Application, StaticFileHandler, RequestHandler
from tornado.ioloop import IOLoop
from tornado.options import define, options, parse_command_line

from .handler import StoryHandler, TaskHandler, SocketHandler
from .models import Session, Base

here = dirname(__file__)


class MainHandler(RequestHandler):
    def get(self):
        self.redirect('/index.html')


class ScratyApplication(Application):
    def __init__(self, db_session=None, debug=False):
        self.db = db_session or Session
        Base.query = self.db.query_property()
        app_path = os.path.join(here, 'static')
        bower_components = os.path.join(here, '..', 'bower_components')
        node_modules = os.path.join(here, '..', 'node_modules')
        handlers = [
            ('/', MainHandler),
            ('/websocket/?', SocketHandler),
            ('/api/stories/?', StoryHandler),
            ('/api/stories/([a-z0-9-]{36})/?', StoryHandler),
            ('/api/tasks/?', TaskHandler),
            ('/api/tasks/([a-z0-9-]{36})/?', TaskHandler),
            ('/bower_components/(.*)', StaticFileHandler, dict(path=bower_components)),
            ('/node_modules/(.*)', StaticFileHandler, dict(path=node_modules)),
            ('/(.*)', StaticFileHandler, dict(path=app_path)),
        ]
        settings = {
            'static_path': app_path
        }
        super().__init__(handlers, debug=debug, **settings)


def main():
    define('port', default=8080, help='run on the given port', type=int)
    define('debug', default=False, help='run in debug mode', type=bool)
    parse_command_line()

    logger = logging.getLogger()
    logger.setLevel(options.debug and logging.DEBUG or logging.WARN)
    app = ScratyApplication(debug=options.debug)
    app.listen(options.port)
    try:
        print('Starting on http://localhost:' + str(options.port))
        IOLoop.instance().start()
    except KeyboardInterrupt:
        sys.exit('Bye')

if __name__ == "__main__":
    main()
