from flask import Flask, render_template, jsonify, request, redirect, url_for
import requests
from flask_paginate import Pagination, get_page_parameter

app = Flask(__name__)
app.static_folder = 'static'

# CABANG
# list-cabang (pilihan liat semua/perkota)

# detail-cabang
def get_cabangByID(id_cabang):
    response = requests.get(f'http://localhost:5002/cabangs/{id_cabang}')
    return response.json()

@app.route('/cabangByID/<int:id_cabang>', methods=['GET'])
def show_cabangByID(id_cabang):
    cabangByID = get_cabangByID(id_cabang)
    return jsonify(cabangByID)


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


# PORT
if __name__ == '__main__':
    app.run(debug=True, port=5010)