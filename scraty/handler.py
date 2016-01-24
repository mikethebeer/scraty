
from tornado.web import RequestHandler


class BaseHandler(RequestHandler):
    pass


class StoryHandler(BaseHandler):

    def get(self):
        self.write('Hello World')
