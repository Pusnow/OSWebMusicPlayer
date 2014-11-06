# -*- coding: utf-8 -*-

from flask import Flask
app = Flask(__name__)


app.config.from_object(__name__)

app.config.from_envvar('FLASKR_SETTINGS', silent=True)

import WebMusicPlayer.View