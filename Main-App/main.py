from flask import Flask, render_template, jsonify, request, redirect, url_for
import requests
from flask_paginate import Pagination, get_page_parameter

app = Flask(__name__)
app.static_folder = 'static'

# CABANG
# list-cabang (pilihan liat semua/perkota)

# detail-cabang

# edit-cabang

# membuat-cabang


# MENU
# list-menu (pilihan lihat semua/perkategori/posisi)

# detail-menu

# edit-menu

# membuat-cabang


# KARYAWAN
# list-karyawan (pilihan lihat semua/cabang/posisi)

# detail-karyawan

# edit-karyawan

# membuat-karyawan


# REVIEW
# list-review (pilihan lihat semua/cabang/menu)

# detail-review

# edit-review

# membuat-review


# AKTIVITAS USER
# list-aktivitas

# Grafik aktivitas