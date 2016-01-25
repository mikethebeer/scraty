
import json
import logging
from tornado.web import RequestHandler

from .models import Story


logger = logging.getLogger(__file__)


class BaseHandler(RequestHandler):

    @property
    def db(self):
        return self.application.db

    @property
    def json_body(self):
        try:
            return json.loads(self.request.body.decode('utf-8'))
        except ValueError:
            logger.warn('json.loads for "%s" failed', self.request.body)
            raise


class StoryHandler(BaseHandler):

    def post(self):
        data = self.json_body
        story = Story(text=data['text'])
        self.db.add(story)
        self.db.commit()
        self.write({
            'status': 'success',
            'data': story.to_dict()
        })

    def get(self, id=None):
        if id:
            story = Story.query.filter(Story.id == id).one()
            self.write({'story': story.to_dict()})
        else:
            stories = [s.to_dict() for s in Story.query.all()]
            self.write({'stories': stories})

    def delete(self, id):
        Story.query.filter(Story.id == id).delete()
        self.write({
            'status': 'success'})
