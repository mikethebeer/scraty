
from datetime import datetime
from uuid import uuid4

import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.types import DateTime, Integer, Unicode

from .config import sqla_params, sqla_uri

engine = sa.create_engine(sqla_uri, **sqla_params)
Session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()


def gen_id():
    return str(uuid4())


class Board(Base):
    __tablename__ = "boards"

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    name = sa.Column(Unicode)
    created = sa.Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "<Board({name})>".format(name=self.name)

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class Story(Base):
    __tablename__ = "stories"

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    link = sa.Column(Unicode)
    position = sa.Column(Integer, default=1)
    board_id = sa.Column(Unicode)
    created = sa.Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "<Story({text})>".format(text=self.text)

    def to_dict(self):
        tasks = Task.query.filter(Task.story_id == self.id).order_by(Task.state).all()
        board = Board.query.filter(Board.id == self.board_id).one()
        return {
            "id": self.id,
            "text": self.text,
            "tasks": [t.to_dict() for t in tasks],
            "position": self.position,
            "link": self.link,
            "board": board.to_dict(),
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
