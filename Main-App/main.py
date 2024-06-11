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
@app.route('/editCabang/<int:id_cabang>', methods=['GET'])
def Formedit_Cabang(id_cabang):
    cabangByID = get_cabangByID(id_cabang)
    return render_template('Cabang/editcabang.html', cabang=cabangByID)

@app.route('/editCabang/<int:id_cabang>', methods=['POST'])
def edit_Cabang(id_cabang):
    data = {
        "nama_cabang": request.form['nama_cabang'],
        "alamat_cabang": request.form['alamat_cabang'],
        "kota_cabang": request.form['kota_cabang'],
        "telp_cabang": request.form['telp_cabang'],
        "gambar_cabang": request.form['gambar_cabang']
    }
    requests.put(f'http://localhost:5002/cabangs/{id_cabang}', json=data)
    return redirect(url_for('show_detailCabang', id_cabang=id_cabang))

# membuat-cabang

# hapus-cabang
@app.route('/deleteCabang/<int:id_cabang>', methods=['GET'])
def delete_cabang(id_cabang):
    response = requests.delete(f'http://localhost:5002/cabangs/{id_cabang}')
    if response.status_code == 200:
        return redirect(url_for(''))
    else:
        return "Error: Unable to delete Cabang.", 400


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
@app.route('/editMenu/<int:id_menu>', methods=['GET'])
def Formedit_Menu(id_menu):
    menuByID = get_MenuByID(id_menu)
    return render_template('Menu/editmenu.html', menu = menuByID)

@app.route('/editMenu/<int:id_menu>', methods=['POST'])
def edit_Menu(id_menu):
    data = {
        "nama_menu": request.form['nama_menu'],
        "posisi_karyawan": request.form['posisi_karyawan'],
        "deskripsi_menu": request.form['deskripsi_menu'],
        "kategori_menu": request.form['kategori_menu'],
        "gambar_menu": request.form['gambar_menu']
    }
    requests.put(f'http://localhost:5001/menuMiliKita/{id_menu}', json=data)
    return redirect(url_for('show_detailMenu', id_menu=id_menu))

# membuat-menu

# hapus-menu
@app.route('/deleteMenu/<int:id_menu>', methods=['GET'])
def delete_menu(id_menu):
    response = requests.delete(f'http://localhost:5001/menuMiliKita/{id_menu}')
    if response.status_code == 200:
        return redirect(url_for(''))
    else:
        return "Error: Unable to delete Menu.", 400



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

# hapus-karyawan


# REVIEW
# list-review (pilihan lihat semua/cabang/menu)

# detail-review

# edit-review

# membuat-review

# hapus-review


# AKTIVITAS USER
# list-aktivitas

# Grafik aktivitas


# PORT
if __name__ == '__main__':
    app.run(debug=True, port=5010)