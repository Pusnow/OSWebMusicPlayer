#-*- coding: utf-8 -*-
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base




Engine = create_engine('mysql://admin:helloworld@localhost/WebMusicPlayer?charset=utf8')

Base = declarative_base()
Session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=Engine))

class album (Base):
	__tablename__ = 'album'
	id = Column(Integer, primary_key=True)
	name = Column(String)
	singer = Column(String)
	length = Column(Integer)
	music_count = Column(Integer)
	year = Column(Integer)

	#music = relationship("music", backref=backref('album', order_by=albumid))

	def __repr__(self):
		return "<Album ('%s')>" %(self.id)


class music (Base):
	__tablename__ = 'music'
	id = Column(Integer, primary_key=True)
	albumid = Column(Integer)
	albumname = Column(String)
	num = Column(Integer)
	name = Column(String)
	singer = Column(String)
	length = Column(Integer)
	genre = Column(String)
	year = Column(Integer)
	filename = Column(Integer)


	def __repr__(self):
		return "<music ('%s')>" %(self.id)

	def diction(self):
		return dict(id=self.id,albumid=self.albumid,albumname=self.albumname,num=self.num,name=self.name,singer=self.singer,length=self.length,genre=self.genre,year=self.year)



class user (Base):
	__tablename__ = 'user'
	id = Column(Integer, primary_key=True)
	name = Column(String)
	pw = Column(String)


	def __repr__(self):
		return "<user ('%s')>" %(self.name)
