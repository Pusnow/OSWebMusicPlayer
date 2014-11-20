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


@app.route('/list')
def list():

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


	return render_template('list_view.html', musiclist = musiclist1, playlist = playlist1)



@app.route('/social')
def social():

	group1 = [
		dict(name=u"어린이 합창단"),
		dict(name=u"한승훈 주식회사")
	]

	user1 = dict(name=u"이성원", grouplist = group1)

	feedlist1 = [
		dict(user = u"한승훈", text =u"한승훈님이 he india me to SBTM! 를 듣고 있습니다."),
		dict(user = u"이성재", text =u"이성재님이 노래방달렷더니힘드네 를 듣고 있습니다.")



	]


	return render_template('social.html', user = user1, feedlist = feedlist1)

@app.route('/group')
def group():
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



	return render_template('group.html', group = group1,albumlist=albumlist1, feedlist = feedlist1)

