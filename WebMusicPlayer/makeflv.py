#-*- coding: utf-8 -*-
import os
import commands

folders = os.listdir("./static/music")

for fold in folders:
	print fold
	musics = os.listdir("./static/music/"+fold)
	for music in musics:
		print music
		os.system('gst-launch-1.0 filesrc location="./static/music/'+fold+'/'+music+'" ! decodebin ! audioconvert ! audioresample ! voaacenc ! flvmux ! filesink location="./static/music/'+fold+'/'+music[0:-4]+'.flv"')
