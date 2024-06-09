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

def get_karyawanByCabang(id_cabang):
    response = requests.get(f'http://localhost:5003/karyawankita/Cabang/{id_cabang}')
    return response.json()

def get_reviewByCabang(id_cabang):
    response = requests.get(f'http://localhost:5000/reviews/cabang/{id_cabang}')
    return response.json()

def get_MenuByID(id_menu):
    response = requests.get(f'http://localhost:5001/menuMiliKita/{id_menu}')
    return response.json()

@app.route('/cabangByID/<int:id_cabang>', methods=['GET'])
def show_detailCabang(id_cabang):
    cabangByID = get_cabangByID(id_cabang)
    karyawanByCabang = get_karyawanByCabang(id_cabang)
    reviewByCabang = get_reviewByCabang(id_cabang)

    menus = []
    for review in reviewByCabang:
        menu = get_MenuByID(review['id_menu'])
        menus.append(menu)
        
    return render_template('Cabang/detailcabang.html', cabang=cabangByID, karyawans=karyawanByCabang, reviews=reviewByCabang, menus=menus)


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