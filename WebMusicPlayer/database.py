#-*- coding: utf-8 -*-
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import sessionmaker, scoped_session, relationship, backref
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
	count = Column(Integer)


	def __repr__(self):
		return "<music ('%s')>" %(self.id)

	def diction(self):
		return dict(id=self.id,albumid=self.albumid,albumname=self.albumname,num=self.num,name=self.name,singer=self.singer,length=self.length,genre=self.genre,year=self.year)


class user (Base):
	__tablename__ = 'user'
	id = Column(Integer, primary_key=True)
	name = Column(String)
	realname = Column(String)
	pw = Column(String)

	def __repr__(self):
		return "<user ('%s')>" %(self.name)

class playlist (Base):
	__tablename__ = 'playlist'
	id = Column(Integer, primary_key=True)
	name = Column(String)
	userid = Column(Integer)


	def __repr__(self):
		return "<playlist ('%s')>" %(self.name)


class playlist_item(Base):
	__tablename__ = 'playlist_item'
	id = Column(Integer, primary_key=True)
	listid = Column(Integer)
	musicid = Column(Integer, ForeignKey('music.id'))
	music = relationship("music")
	order = Column(Integer)

	def __repr__(self):
		return "<playlist_item ('%s')>" %(self.id)


class feed(Base):
	__tablename__ = 'feed'
	id = Column(Integer, primary_key=True, autoincrement = True)
	userid = Column(Integer, ForeignKey('user.id'))
	user = relationship("user")
	title = Column(String)
	text = Column(String)

	def __repr__(self):
		return "<feed ('%s')>" %(self.title)