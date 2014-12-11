#-*- coding:utf-8 -*-드
#웹 요청 처리 코드, 대부분의 서버 프로그래밍 코드
from WebMusicPlayer import app
from flask import render_template,request,jsonify, session, flash, redirect, url_for
from database import Session, music, album, user, playlist,playlist_item, feed
import os
import subprocess
import hashlib
from datetime import datetime
from sqlalchemy.sql import func

app.config.update(dict(
	SECRET_KEY = hashlib.md5(str(datetime.today())).hexdigest()
	))

@app.teardown_request
def shutdown_session(exception=None):
    pass#subprocess.call(["rm","/tmp/flvs/*.flv"])



@app.route('/')
def index():
	if session.get('logged_in'):
		return redirect(url_for('main'))

	new = Session.query(music).order_by(music.id.desc())[0:10]
	most = Session.query(music).order_by(music.count.desc())[0:10]

	return render_template('login.html', most=most, new = new)

@app.route('/login', methods=["POST"])
def login ():
	loginuser = Session.query(user).filter(user.name == request.form['username']).all()
	print loginuser
	if not loginuser :
		error = 'Invalid username'
	elif hashlib.md5(request.form['password']).hexdigest() != loginuser[0].pw :
		error = 'Invalid password'
	else:
			session['logged_in'] = True
			session['userid'] = loginuser[0].id
			session['username'] = loginuser[0].name
			session['realname'] = loginuser[0].realname
			#flash('You were logged in')
			return redirect(url_for('main'))
	print error
	return redirect(url_for('index'))


@app.route('/logout')
def logout():
	session.pop('logged_in', None)
	return redirect(url_for('index'))


@app.route('/main', methods=["GET","POST"])
def main():
	if not session.get('logged_in'):
		return redirect(url_for('index'))
	if request.method == 'POST':
		post = True
	else :
		post = False


	albumlist1 = Session.query(album).order_by(album.id).all()

	return render_template('album_view.html', albumlist=albumlist1, post=post)


@app.route('/list',methods=["GET","POST"])
def list():
	if not session.get('logged_in'):
		return redirect(url_for('index'))
	if request.method == 'POST':
		post = True

	else :
		post = False


	playlist1 = Session.query(playlist).filter(playlist.userid==session['userid']).all() 



	return render_template('list_view.html', playlist = playlist1, post=post)



@app.route('/social',methods=["GET","POST"])
def social():
	if not session.get('logged_in'):
		return redirect(url_for('index'))
	if request.method == 'POST':
		post = True
	else :
		post = False
	group1 = [
		dict(name=u"어린이 합창단"),
		dict(name=u"한승훈 주식회사")
	]

	user1 = dict(name=session['realname'] , grouplist = group1)

	feedlist = Session.query(feed).filter(feed.userid==session['userid']).order_by(feed.id.desc()).all()

	return render_template('social.html', user = user1, feedlist = feedlist, post=post)

@app.route('/user/<id>',methods=["GET","POST"])
def usersocial(id):
	user1 = Session.query(user).filter(user.id == id).first()
	if request.method == 'POST':
		post = True
	else :
		post = False
	group1 = [
		dict(name=u"어린이 합창단"),
		dict(name=u"한승훈 주식회사")
	]

	

	feedlist = Session.query(feed).filter(feed.userid==id).order_by(feed.id.desc()).all()
	user1 = dict(name=user1.realname, grouplist = group1)
	return render_template('social.html', user = user1, feedlist = feedlist, post=post)



@app.route('/group',methods=["GET","POST"])
def group():
	if not session.get('logged_in'):
		return redirect(url_for('index'))
	if request.method == 'POST':
		post = True
	else :
		post = False
	memlist = [u"이성원",u"이성원 클론 1",u"이성원 클론 2 ",u"이성원 클론 3",u"이성원 클론 4"]
	group1 = dict (name=u"어린이 합창단", memberlist = memlist)
	albumlist1 = [
	dict(name=u"끼이익",singer=u"이성원"),
	dict(name=u"test",singer=u"test1"),
	dict(name=u"test",singer=u"test1"),
	
	]
	feedlist1 = [
		dict(user = u"이성원", text =u"연세대학교 공학관 A 에서 성공적인 공연을 하였습니다."),
		dict(user = u"이성원 클론1", text =u"신촌 문화의 거리에서 성공적인 공연을 하였습니다.")
	]



	return render_template('group.html', group = group1,albumlist=albumlist1, feedlist = feedlist1, post=post)


@app.route('/albuminfo', methods=['POST'])
def albuminfo ():
	data = request.get_json()

	album1 = Session.query(album).filter(album.id==data['id']).one()
	json_data = dict(id = data['id'] ,name=album1.name,singer=album1.singer, url=album1.name+'.jpg', musicnum = album1.music_count)
	musiclist1=[]
	for m in Session.query(music).filter(music.albumid==data['id']).order_by(music.num).all():
		musiclist1.append(m.diction())
	json_data ["musiclist"] =musiclist1
	return jsonify(json_data)

@app.route('/musicstream', methods=['POST'])
def musicstream ():
	data = request.get_json()

	music1 = Session.query(music).filter(music.id==data['id']).one()
	origin = os.getcwd() + "/WebMusicPlayer/static/music/" + music1.filename[:-4] +".flv"
	#time hash : hashlib.md5(str(datetime.today())).hexdigest()
	flvfile = unicode(session['userid']) +"_"+hashlib.md5(str(datetime.today())).hexdigest() + ".flv"
	link = "/tmp/flvs/" + flvfile

	if os.path.isfile(origin):
		#subprocess.call(["rm /tmp/flvs/"+ unicode(session['userid']) +"_*.flv"],shell=True)
		subprocess.call(["ln","-s",origin,link])
		json_data = dict (flv = flvfile)
		Session.query(music).filter(music.id==data['id']).update({"count": music1.count+1})
		Session.add(feed(title=session['realname'],text =(session['realname'] + u"님이 "+music1.name+u"을 들었습니다."), userid=session['userid']))
		Session.commit()
	else :
		json_data = dict (flv = "")
		print "File Not Found : " + origin
	
	
	return jsonify(json_data)

@app.route('/addfav', methods=['POST'])
def addfav():
	data = request.get_json()
	playlist1 = Session.query(playlist).filter(playlist.userid==session['userid']).order_by(playlist.id).first()
	maxorder = Session.query(func.max(playlist_item.order)).filter(playlist_item.listid == playlist1.id).first()[0]
	if not maxorder:
		maxorder = 0
	Session.add(playlist_item(listid=playlist1.id, musicid=data['id'], order=maxorder+1))
	Session.commit()
	return "Success"

@app.route('/dellistitem', methods=['POST'])
def dellistitem():
	data = request.get_json()
	Session.query(playlist_item).filter(playlist_item.order == data['order']).filter(playlist_item.listid==data['listid']).delete()
	Session.commit()
	return "Success"




@app.route('/getlist', methods=['POST'])
def getlist():
	data = request.get_json()
	item = Session.query(playlist_item).filter(playlist_item.listid==data['id']).order_by(playlist_item.order).all()
	json_data = dict(id = data['id'])
	musiclist = []
	for m in item:
		mm = m.music.diction()
		mm["order"] = m.order
		musiclist.append(mm)
		
	json_data ["name"] = Session.query(playlist.name).filter(playlist.id==data['id']).first()
	json_data ["musiclist"] =musiclist
	return jsonify(json_data)


