
import json
import logging
from functools import wraps
from tornado.web import RequestHandler, HTTPError
from tornado.websocket import WebSocketHandler, WebSocketClosedError

import sqlalchemy.orm.exc

from .models import Story, Task, User


logger = logging.getLogger(__file__)


class SocketHandler(WebSocketHandler):

    clients = set()

    def open(self):
        SocketHandler.clients.add(self)

    def on_message(self, message):
        pass

    def on_close(self):
        SocketHandler.clients.remove(self)

    @classmethod
    def send_message(cls, object_type, action, obj):
        message = {
            'action': action,
            'object_type': object_type,
            'object': obj.to_dict()
        }
        message = json.dumps(message)
        for client in cls.clients:
            try:
                client.write_message(message)
            except WebSocketClosedError:
                cls.clients.remove(client)


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


def fail(rh, status_code, exception):
    rh.db.rollback()
    rh.set_status(status_code)
    e = exception
    message = hasattr(e, 'message') and e.message or str(e)
    message = message or repr(e)
    rh.write({
        'status': 'failure',
        'message': message or repr(e)
    })


def handle_exception(f):
    @wraps(f)
    def wrapper(self, *args, **kwargs):
        try:
            f(self, *args, **kwargs)
        except sqlalchemy.orm.exc.NoResultFound:
            self.db.rollback()
            raise HTTPError(404)
        except (TypeError, KeyError, ValueError) as e:
            fail(self, 400, e)
        except Exception as e:
            fail(self, 500, e)
    return wrapper


class StoryHandler(BaseHandler):

    @staticmethod
    def update(id, data):
        story = Story.query.filter(Story.id == id).one()
        return update_from_dict(story, data)

    @handle_exception
    def post(self, id=None):
        if id:
            story = self.update(id, self.json_body())
            action = 'updated'
        else:
            story = Story(**self.json_body())
            self.db.add(story)
            action = 'added'
        self.db.commit()
        SocketHandler.send_message('story', action, story)
        self.write({
            'status': 'success',
            'data': story.to_dict()
        })

    @handle_exception
    def get(self, id=None):
        if id:
            story = Story.query.filter(Story.id == id).one()
            self.write({'story': story.to_dict()})
        else:
            q = Story.query.order_by(Story.position)
            stories = [s.to_dict() for s in q.all()]
            self.write({'stories': stories})

    @handle_exception
    def delete(self, id):
        story = Story.query.filter(Story.id == id).one()
        self.db.delete(story)
        Task.query.filter(Task.story_id == id).delete()
        self.db.commit()
        SocketHandler.send_message('story', 'deleted', story)
        self.write({'status': 'success'})


class TaskHandler(BaseHandler):

    @staticmethod
    def update(id, data):
        task = Task.query.filter(Task.id == id).one()
        return update_from_dict(task, data)

    @handle_exception
    def post(self, id=None):
        if id:
            task = self.update(id, self.json_body())
            action = 'updated'
        else:
            task = Task(**self.json_body())
            action = 'added'
            self.db.add(task)
        self.db.commit()
        SocketHandler.send_message('task', action, task)
        self.write({
            'status': 'success',
            'data': task.to_dict()
        })

    @handle_exception
    def get(self, id=None):
        if id:
            task = Task.query.filter(Task.id == id).one()
            self.write({'task': task.to_dict()})
        else:
            tasks = [t.to_dict() for t in Task.query.all()]
            self.write({'tasks': tasks})

    @handle_exception
    def delete(self, id):
        task = Task.query.filter(Task.id == id).one()
        self.db.delete(task)
        self.db.commit()
        SocketHandler.send_message('task', 'deleted', task)
        self.write({'status': 'success'})


class UserHandler(BaseHandler):

    @staticmethod
    def update(name, data):
        user = User.query.filter(User.name == name).one()
        return update_from_dict(user, data)

    @handle_exception
    def post(self, name=None):
        if name:
            user = self.update(name, self.json_body())
            action = 'updated'
        else:
            user = User(**self.json_body())
            action = 'added'
            self.db.add(user)
        self.db.commit()
        SocketHandler.send_message('user', action, user)
        self.write({
            'status': 'success',
            'data': user.to_dict()
        })

    @handle_exception
    def get(self, name=None):
        if name:
            user = User.query.filter(User.name == name).one()
            self.write({'user': user.to_dict()})
        else:
            users = [u.to_dict() for u in User.query.all()]
            self.write({'users': users})

    @handle_exception
    def delete(self, name):
        user = User.query.filter(User.name == name).one()
        self.db.delete(user)
        self.db.commit()
        SocketHandler.send_message('user', 'deleted', user)
        self.write({'status': 'success'})
