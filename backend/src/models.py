from datetime import datetime
from uuid import uuid4

import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.types import DateTime, Integer, Unicode
from tornado.options import define, options, parse_command_line

define("crate-host", default="localhost:4200", help="CrateDB host", type=str)
parse_command_line()

engine = sa.create_engine(f"crate://{options.crate_host}")
Session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()


def gen_id():
    return str(uuid4())


class Story(Base):
    __tablename__ = "stories"

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    link = sa.Column(Unicode)
    position = sa.Column(Integer, default=1)
    created = sa.Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "<Story({text})>".format(text=self.text)

    def to_dict(self):
        tasks = Task.query.filter(Task.story_id == self.id).order_by(Task.state).all()
        return {
            "id": self.id,
            "text": self.text,
            "tasks": [t.to_dict() for t in tasks],
            "position": self.position,
            "link": self.link,
        }


class Task(Base):
    __tablename__ = "tasks"

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    user = sa.Column(Unicode)
    state = sa.Column(Integer, default=0)
    story_id = sa.Column(Unicode)
    created = sa.Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "<Task({text})>".format(text=self.text[:20])

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "user": self.user,
            "state": self.state,
            "story_id": self.story_id,
        }


def main():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    main()
