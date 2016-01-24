
import sys
import logging
from tornado.web import Application
from tornado.ioloop import IOLoop
from tornado.options import define, options, parse_command_line

from .handler import StoryHandler


class ScratyApplication(Application):

    def __init__(self, db_session=None, debug_mode=False):
        self.db = db_session
        handlers = [
            ('/', StoryHandler),
        ]
        super().__init__(handlers, debug=debug_mode)


def main():
    define('port', default=8080, help='run on the given port', type=int)
    define('debug', default=False, help='run in debug mode', type=bool)
    parse_command_line()

    logger = logging.getLogger()
    logger.setLevel(options.debug and logging.DEBUG or logging.WARN)
    app = ScratyApplication(debug_mode=options.debug)
    app.listen(options.port)
    try:
        print('Starting on http://localhost:' + str(options.port))
        IOLoop.instance().start()
    except KeyboardInterrupt:
        sys.exit('Bye')


if __name__ == "__main__":
    main()
