
import sqlalchemy as sa
from sqlalchemy.types import Unicode
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4

from .config import sqla_uri, sqla_params


engine = sa.create_engine(sqla_uri, **sqla_params)
Session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()


def gen_id():
    return str(uuid4())


class Story(Base):
    __tablename__ = 'stories'

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    link = sa.Column(Unicode)

    tasks = relationship('Task', back_populates='story')

    def __repr__(self):
        return '<Story({text})>'.format(text=self.text)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'link': self.link,
        }


class Task(Base):
    __tablename__ = 'tasks'

    id = sa.Column(Unicode, primary_key=True, default=gen_id)
    text = sa.Column(Unicode)
    user = sa.Column(Unicode)
    story_id = sa.Column(Unicode, sa.ForeignKey('stories.id'))

    story = relationship('Story', back_populates='tasks')

    def __repr__(self):
        return '<Task({text})>'.format(text=self.text[:20])


def main():
    Base.metadata.create_all(bind=engine)
    from IPython import embed
    embed()


if __name__ == "__main__":
    main()
