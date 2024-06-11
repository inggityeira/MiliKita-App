from flask import Flask, render_template, jsonify, request, redirect, url_for
from collections import defaultdict
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
    menus = {}
    for review in reviewByCabang:
        menu_id = review['id_menu']
        if menu_id not in menus:
            menus[menu_id] = get_MenuByID(menu_id)['nama_menu']
    grouped_reviews = defaultdict(list)
    for review in reviewByCabang:
        menu_name = menus[review['id_menu']]
        grouped_reviews[menu_name].append(review)
    return render_template('Cabang/detailcabang.html', cabang=cabangByID, karyawans=karyawanByCabang, grouped_reviews=grouped_reviews, menus=menus)

# edit-cabang

# membuat-cabang


# MENU
# list-menu (pilihan lihat semua/perkategori/posisi)

# detail-menu
def get_reviewByMenu(id_menu):
    response = requests.get(f'http://localhost:5000/reviews/menu/{id_menu}')
    return response.json()

@app.route('/menuByID/<int:id_menu>', methods=['GET'])
def show_detailMenu(id_menu):
    menuByID = get_MenuByID(id_menu)
    reviewByMenu = get_reviewByMenu(id_menu)
    return render_template('Menu/detailmenu.html', menu = menuByID, reviews = reviewByMenu)

# edit-menu

# membuat-cabang


# KARYAWAN
# list-karyawan (pilihan lihat semua/cabang/posisi)

# detail-karyawan
def get_KaryawanById(id_karyawan):
    response = requests.get(f'http://localhost:5003/karyawankita/{id_karyawan}')
    return response.json()

def get_CabangById(id_cabang):
    response = requests.get(f'http://localhost:5002/cabangs/{id_cabang}')
    return response.json()

# @app.route('/KaryawanByID/<int:id_karyawan>', methods=['GET'])
# def show_detailKaryawan(id_karyawan, id_cabang):
#     KaryawanByID = get_KaryawanById (id_karyawan)
#     CabangByID = get_CabangById(id_cabang)
#     return render_template('Karyawan/detailkaryawan.html', Karyawan=KaryawanByID, Cabang=CabangById)

# @app.route('/CabangByID/<int:id_cabang>', methods=['GET'])
# def show_idCabang(id_cabang):
#     CabangByID = get_CabangById(id_cabang)
    
    
    

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