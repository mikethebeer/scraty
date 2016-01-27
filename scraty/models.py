
import sqlalchemy as sa
from sqlalchemy.types import Unicode, Integer, DateTime
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
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

    create_table = '''
create table if not exists stories (
    id string primary key,
    position integer,
    text string,
    link string,
    created timestamp
) with (number_of_replicas = 0)'''

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    link = sa.Column(Unicode)
    position = sa.Column(Integer, default=1)
    created = sa.Column(DateTime, default=datetime.utcnow)

    tasks = relationship('Task', back_populates='story')

    def __repr__(self):
        return '<Story({text})>'.format(text=self.text)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'tasks': [t.to_dict() for t in self.tasks],
            'position': self.position,
            'link': self.link,
        }


class Task(Base):
    __tablename__ = 'tasks'

    create_table = '''
create table if not exists tasks (
    id string primary key,
    story_id string,
    text string,
    user string,
    state integer,
    user_id string,
    created timestamp
) with (number_of_replicas = 0)'''

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    user = sa.Column(Unicode)
    state = sa.Column(Integer, default=0)
    story_id = sa.Column(Unicode, sa.ForeignKey('stories.id'))
    created = sa.Column(DateTime, default=datetime.utcnow)

    story = relationship('Story', back_populates='tasks')

    def __repr__(self):
        return '<Task({text})>'.format(text=self.text[:20])

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'user': self.user,
            'state': self.state,
            'story_id': self.story_id
        }


def main():
    conn = engine.connect()
    conn.execute(Story.create_table)
    conn.execute(Task.create_table)


if __name__ == "__main__":
    main()
