
import json
import logging
from functools import wraps
from tornado.web import RequestHandler

from .models import Story, Task


logger = logging.getLogger(__file__)


class BaseHandler(RequestHandler):

    @property
    def db(self):
        return self.application.db

    def json_body(self):
        try:
            return json.loads(self.request.body.decode('utf-8'))
        except ValueError:
            logger.warn('json.loads for "%s" failed', self.request.body)
            raise


def update_from_dict(obj, d):
    for key, value in d.items():
        if hasattr(obj, key):
            setattr(obj, key, value)
        else:
            raise ValueError(
                "Object {0} doesn't have a property named '{1}'".format(obj, key))
    return obj


def exception_to_json(f):
    @wraps(f)
    def wrapper(self, *args, **kwargs):
        try:
            f(self, *args, **kwargs)
        except Exception as e:
            self.write({
                'status': 'failure',
                'message': hasattr(e, 'message') and e.message or str(e)
            })
    return wrapper


class StoryHandler(BaseHandler):

    @staticmethod
    def update(id, data):
        story = Story.query.filter(Story.id == id).one()
        return update_from_dict(story, data)

    @staticmethod
    def new_story(data):
        return Story(**data)

    @exception_to_json
    def post(self, id=None):
        if id:
            story = self.update(id, self.json_body())
        else:
            story = Story(**self.json_body())
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
        self.db.commit()
        self.write({'status': 'success'})


class TaskHandler(BaseHandler):

    @staticmethod
    def update_task(id, data):
        task = Task.query.filter(Task.id == id).one()
        return update_from_dict(task, data)

    @exception_to_json
    def post(self, id=None):
        if id:
            task = self.update_task(id, self.json_body())
        else:
            task = Task(**self.json_body())
            self.db.add(task)

        self.db.commit()
        self.write({
            'status': 'success',
            'data': task.to_dict()
        })

    def get(self, id=None):
        if id:
            task = Task.query.filter(Task.id == id).one()
            self.write({'task': task.to_dict()})
        else:
            tasks = [t.to_dict() for t in Task.query.all()]
            self.write({'tasks': tasks})

    def delte(self, id):
        Task.query.filter(Task.id == id).delete()
        self.db.commit()
        self.write({'status': 'success'})
