#-*- coding: utf-8 -*-드
#폴더를 돌면서 음악 파일을 flv 파일로 인코딩하는 코드
import os
import commands

folders = os.listdir("./static/music")

for fold in folders:
	print fold
	musics = os.listdir("./static/music/"+fold)
	for music in musics:
		print music
		os.system('gst-launch-1.0 filesrc location="./static/music/'+fold+'/'+music+'" ! decodebin ! audioconvert ! audioresample ! voaacenc ! flvmux ! filesink location="./static/music/'+fold+'/'+music[0:-4]+'.flv"')
