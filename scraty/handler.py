
from tornado.web import RequestHandler


class BaseHandler(RequestHandler):

    @property
    def db(self):
        return self.application.db


class StoryHandler(BaseHandler):

    def get(self):
        self.write('Hello World')
