import sqlalchemy as sa
from sqlalchemy.types import Unicode, Integer, DateTime
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4
from datetime import datetime

from .config import sqla_uri, sqla_params


engine = sa.create_engine(sqla_uri, **sqla_params)
Session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()


def gen_id():
    return str(uuid4())


class Story(Base):
    __tablename__ = 'stories'
    __table_args__ = {'schema': 'scraty'}

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    link = sa.Column(Unicode)
    position = sa.Column(Integer, default=1)
    created = sa.Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Story({text})>'.format(text=self.text)

    def to_dict(self):
        tasks = (Task.query
                 .filter(Task.story_id == self.id)
                 .order_by(Task.state)
                 .all())
        return {
            'id': self.id,
            'text': self.text,
            'tasks': [t.to_dict() for t in tasks],
            'position': self.position,
            'link': self.link,
        }


class Task(Base):
    __tablename__ = 'tasks'
    __table_args__ = {'schema': 'scraty'}

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    user = sa.Column(Unicode)
    state = sa.Column(Integer, default=0)
    story_id = sa.Column(Unicode)
    created = sa.Column(DateTime, default=datetime.utcnow)
    stars = sa.Column(Integer, default=0)

    def __repr__(self):
        return '<Task({text})>'.format(text=self.text[:20])

    def to_dict(self):
        users = (User.query
                    .filter(User.name == self.user)
                    .order_by(User.name)
                    .all())

        return {
            'id': self.id,
            'text': self.text,
            'user': [u.to_dict() for u in users],
            'state': self.state,
            'story_id': self.story_id
        }


class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'scraty'}

    name = sa.Column(Unicode, primary_key=True)
    color = sa.Column(Unicode)

    def __repr__(self):
        return '<User({name})>'.format(name=self.name)

    def to_dict(self):
        return {
            'name': self.name,
            'color': self.color
        }

def main():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    main()
