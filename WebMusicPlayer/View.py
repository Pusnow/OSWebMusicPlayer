#-*- coding:utf-8 -*-
from WebMusicPlayer import app
from flask import render_template



@app.teardown_request
def shutdown_session(exception=None):
    #DB 세션 끊을 것
    pass



@app.route('/')
def index():
    return render_template('login.html')


@app.route('/main')
def main():
	albumlist1 = [
	dict(name=u"끼이익",singer=u"이성원"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1")
	]
	return render_template('album_view.html', albumlist=albumlist1)