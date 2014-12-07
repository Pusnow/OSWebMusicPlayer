#-*- coding:utf-8 -*-
from WebMusicPlayer import app
from flask import render_template,request,jsonify
from database import Session, music, album
import os
import subprocess
import hashlib
from datetime import datetime


@app.teardown_request
def shutdown_session(exception=None):
    pass#subprocess.call(["rm","/tmp/flvs/*.flv"])



@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=["GET","POST"])
def login ():
	if request.form['username'] != app.config['USERNAME']:
		error = 'Invalid username'
	elif request.form['password'] != app.config['PASSWORD']:
		error = 'Invalid password'
	else:
			session['logged_in'] = True
			flash('You were logged in')
			return redirect(url_for('show_entries'))
	return render_template('login.html', error=error)



@app.route('/main', methods=["GET","POST"])
def main():
	if request.method == 'POST':
		post = True
	else :
		post = False


	albumlist1 = Session.query(album).order_by(album.id).all()
	for a in albumlist1 :
		print a.name+".jpg"

	return render_template('album_view.html', albumlist=albumlist1, post=post)


@app.route('/list',methods=["GET","POST"])
def list():
	if request.method == 'POST':
		post = True

	else :
		post = False
	musiclist1 = [
	dict(name=u"끼이익",singer=u"이성원", length = 123),
	dict(name=u"test",singer=u"test1", length = 123),
	dict(name=u"test",singer=u"test1", length = 123),
	dict(name=u"test",singer=u"test1", length = 123),
	dict(name=u"test",singer=u"test1", length = 123),
	dict(name=u"test",singer=u"test1", length = 123),
	dict(name=u"test",singer=u"test1", length = 123),
	dict(name=u"test",singer=u"test1", length = 123),
	dict(name=u"test",singer=u"test1", length = 123),
	dict(name=u"test",singer=u"test1", length = 123)
	]
	playlist1 = [
		dict(name=u"좋아하는 음악"),
		dict(name=u"싫어하는 음악"),
		dict(name=u"어중간 음악")


	]


	return render_template('list_view.html', musiclist = musiclist1, playlist = playlist1, post=post)



@app.route('/social',methods=["GET","POST"])
def social():
	if request.method == 'POST':
		post = True
	else :
		post = False
	group1 = [
		dict(name=u"어린이 합창단"),
		dict(name=u"한승훈 주식회사")
	]

	user1 = dict(name=u"이성원", grouplist = group1)

	feedlist1 = [
		dict(user = u"한승훈", text =u"한승훈님이 he india me to SBTM! 를 듣고 있습니다."),
		dict(user = u"이성재", text =u"이성재님이 노래방달렷더니힘드네 를 듣고 있습니다.")



	]


	return render_template('social.html', user = user1, feedlist = feedlist1, post=post)

@app.route('/group',methods=["GET","POST"])
def group():
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
	origin = os.getcwd() + "/WebMusicPlayer/static/music/" + music1.filename[1:-4] +".flv"
	#time hash : hashlib.md5(str(datetime.datetime.today())).hexdigest()
	flvfile = hashlib.md5(str(datetime.today())).hexdigest() + ".flv"
	link = "/tmp/flvs/" + flvfile

	if os.path.isfile(origin):
		subprocess.call(["rm /tmp/flvs/*.flv"],shell=True)
		subprocess.call(["ln","-s",origin,link])
	else :
		print "File Not Found : " + origin
	json_data = dict (flv = flvfile)
	
	return jsonify(json_data)