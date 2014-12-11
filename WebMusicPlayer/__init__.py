# -*- coding: utf-8 -*-
# Flask 웹 서버 시작을 위한 코드

from flask import Flask
app = Flask(__name__)


app.config.from_object(__name__)

app.config.from_envvar('FLASKR_SETTINGS', silent=True)

import WebMusicPlayer.View