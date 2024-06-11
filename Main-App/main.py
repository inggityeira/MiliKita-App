from flask import Flask, render_template, jsonify, request, redirect, make_response, url_for
from collections import defaultdict
import requests
import jwt
from functools import wraps
from flask_paginate import Pagination, get_page_parameter

app = Flask(__name__)
app.static_folder = 'static'
JWT_SECRET = '6f8a8e7c8a9b1c4a2e4d8e8f6c8b9a1c2d4f6a7b9c8d4f1e2a7b9c8d4f1e2a3b9c8d4f1e2a3b9c8d4f1e2a3';

# #Landing
@app.route('/', methods=['GET'])
def landing_page():
    return render_template('/Auth-Service/landing.html')

# Register
@app.route('/register', methods=['GET'])
def show_register_form():
    return render_template('/Auth-Service/register.html')

@app.route('/register', methods=['POST'])
def register_user():
    data = {
        'nama_lengkap': request.form['nama_cabang'],
        'email': request.form['email'],
        'password': request.form['password']
    }
    requests.post('http://localhost:5005/register', json=data)
    return redirect(url_for('form_login'))

# Login
@app.route('/loginUserKita', methods=['GET'])
def form_login():
    return render_template('Auth-Service/login.html')

# Middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        elif 'token' in request.cookies:
            token = request.cookies.get('token')
        if not token:
            return redirect(url_for('form_login'))
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = data
        except jwt.ExpiredSignatureError:
            return redirect(url_for('form_login'))
        except jwt.InvalidTokenError:
            return redirect(url_for('form_login'))

        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/login', methods=['POST'])
def login():
    data = {
        "email": request.form['email'],
        "password": request.form['password'],
    }
    response = requests.post('http://localhost:5005/login', json=data)
    if response.status_code == 200:
        token = response.headers.get('Authorization').split(" ")[1]
        if token:
            resp = make_response(redirect(url_for('add_menu_form')))
            resp.set_cookie('token', token)
            return resp
        else:
            return "Authorization header not found", 400
    else:
        return "Failed to log in", response.status_code

# CABANG
# list-cabang (Seluruh Cabang)
def get_AllCabang():
    response = requests.get(f'http://localhost:5002/cabang')
    return response.json()

# list-cabang (Berdasarkan Kota)
def get_cabangByKota(kota_cabang):
    response = requests.get(f'http://localhost:5002//cabangs/kota/{kota_cabang}')
    return response.json()

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
@token_required
def show_detailCabang(current_user, id_cabang):
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
@token_required
def Formedit_Cabang(current_user, id_cabang):
    cabangByID = get_cabangByID(id_cabang)
    return render_template('Cabang/editcabang.html', cabang=cabangByID)

@app.route('/editCabang/<int:id_cabang>', methods=['POST'])
@token_required
def edit_Cabang(current_user, id_cabang):
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
# Fitur Add Cabang
@app.route('/cabangs', methods=['GET'])
@token_required
def add_cabang_form(current_user):
    return render_template('Cabang/addcabang.html')

@app.route('/cabangs', methods=['POST'])
@token_required
def add_cabang(current_user):
    data = {
        "nama_cabang": request.form['nama_cabang'],
        "alamat_cabang": request.form['alamat_cabang'],
        "kota_cabang": request.form['kota_cabang'],
        "telp_cabang": request.form['telp_cabang'],
        "gambar_cabang": request.form['gambar_cabang']
    }
    response = requests.post('http://localhost:5002/cabangs/', json=data)
    return redirect(url_for('add_cabang_form'))

# hapus-cabang
@app.route('/deleteCabang/<int:id_cabang>', methods=['GET'])
@token_required
def delete_cabang(current_user, id_cabang):
    response = requests.delete(f'http://localhost:5002/cabangs/{id_cabang}')
    if response.status_code == 200:
        return redirect(url_for(''))
    else:
        return "Error: Unable to delete Cabang.", 400


# MENU
# list-menu (pilihan lihat semua/perkategori/posisi)
def get_list_menu():
    response = requests.get('http://localhost:5001/menusMiliKita')
    return response.json()

@app.route('/menusMiliKita', methods=['GET'])
def listmenu():
    listMenu = get_list_menu()
    page = request.args.get(get_page_parameter(), type=int, default=1)
    per_page = 4
    offset = (page - 1) * per_page
    total = len(listMenu)
    paginated_list = listMenu[offset: offset + per_page]
    pagination = Pagination(page=page, total=total, per_page=per_page, css_framework='bootstrap4')

    return render_template('Menu/listmenu.html', listMenu=paginated_list, pagination=pagination)
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
@app.route('/menuMiliKita', methods=['GET'])
@token_required
def add_menu_form(current_user):
    return render_template('Menu/addmenu.html')

@app.route('/menuMiliKita', methods=['POST'])
def add_menu():
    data = {
        "nama_menu": request.form['nama_menu'],
        "kategori_menu": request.form['kategori_menu'],
        "posisi_karyawan": request.form['posisi_karyawan'],
        "deskripsi_menu": request.form['deskripsi_menu'],
        "gambar_menu": request.form['gambar_menu']
    }
    response = requests.post('http://localhost:5001/menuMiliKita/', json=data)
    return redirect(url_for('add_menu_form'))

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


@app.route('/KaryawanByID/<int:id_karyawan>', methods=['GET'])
def show_detailKaryawan(id_karyawan):
    KaryawanByID = get_KaryawanById(id_karyawan)

    return render_template('Karyawan/detailkaryawan.html', Karyawan=KaryawanByID)

# Fungsi untuk mendapatkan data karyawan

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
def get_allaktivitas():
    response = requests.get('http://localhost:5004/AllAktivitas')
    return response.json()

@app.route('/AktivitasUser', methods=['GET'])
def list_aktivitas():
    aktivitas = get_allaktivitas()
    return render_template('Aktivitas-User/list.html', aktivitas=aktivitas)

# Grafik aktivitas
def count_services(aktivitas):
    categories = ['Review', 'Menu', 'Karyawan', 'Cabang']
    counts = {category: 0 for category in categories}
    for a in aktivitas:
        service = a.get('Service')
        if service in categories:
            counts[service] += 1
    return counts

@app.route('/chart-data', methods=['GET'])
def chart_data():
    aktivitas = get_allaktivitas()
    counts = count_services(aktivitas)
    return jsonify(counts)

@app.route('/chart', methods=['GET'])
def list_chartkita():
    return render_template('Aktivitas-User/chartactivity.html')


# PORT
if __name__ == '__main__':
    app.run(debug=True, port=5010)