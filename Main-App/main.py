from flask import Flask, render_template, jsonify, request, redirect, session, url_for
from collections import defaultdict
import requests
from functools import wraps
from flask_paginate import Pagination, get_page_parameter

app = Flask(__name__)
app.static_folder = 'static'

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

# #Login dan Token
# @app.route('/loginUserKita', methods=['GET'])
# def login_form():
#     return render_template('Auth-Service/login.html')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         email = request.form['email']
#         password = request.form['password']
#         response = requests.post('http://localhost:5005/login', json={'email': email, 'password': password})

#         print('Response status code:', response.status_code)
#         print('Response JSON:', response.json())

#         if response.status_code == 200:
#             data = response.json()
#             session['token'] = data['token']
#             return redirect(url_for('dashboard'))
#         else:
#             return "Login failed: Invalid credentials", 400

#     return render_template('/Auth-Service/login.html')

# def login_required(f):
#     def wrap(*args, **kwargs):
#         if 'token' not in session:
#             return redirect(url_for('dashboard'))
#         return f(*args, **kwargs)
#     wrap.__name__ = f.__name__
#     return wrap

# @app.route('/dashboard')
# @login_required
# def dashboard():
    
    # token = session.get('token')
    # payload = {'token': token}
    # response = requests.get('http://localhost:5005/dashboard', json=payload)
    # if response.status_code == 200:
    #     dashboard_data = response.json()
    #     return render_template('/Auth-Service/dashboard.html', data=dashboard_data)
    # else:
    #     return "Could not verify token", 400

# Login
@app.route('/loginUserKita', methods=['GET'])
def form_login():
    return render_template('Auth-Service/login.html')

def getUser(headers):
    getUser_response = requests.get('http://localhost:5005/ownerkita', headers=headers)

@app.route('/login', methods=['POST'])
def login():
    data = {
        "email": request.form['email'],
        "password": request.form['password'],
    }
    response = requests.post('http://localhost:5005/login', json=data)
    if response.status_code == 200:
        token = response.json().get('token')
        headers = {'Authorization': 'Bearer ' + token}
        response = redirect(url_for('add_menu_form'))
        return response
    else:
        return "Failed to log in"

# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = None
#         if 'Authorization' in request.headers:
#             token = request.headers['Authorization']

#         if not token:
#             return redirect(url_for('form_login'))

#         try:
#             response = requests.get('http://localhost:5005/ownerkita', headers={'Authorization': token})
#             if response.status_code != 200:
#                 return redirect(url_for('form_login'))
#         except Exception as e:
#             print(f"An error occurred: {e}")
#             return redirect(url_for('form_login'))

#         return f(*args, **kwargs)

#     return decorated

#Cabang
#List Seluruh Cabang
@app.route('/cabang', methods=['GET'])
def list_cabang():
    response = requests.get(f'http://localhost:5002/cabang')
    cabang_data = response.json()
    return render_template('Cabang/listcabang.html', cabang=cabang_data)

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
@app.route('/cabangs', methods=['GET'])
def add_cabang_form():
    return render_template('Cabang/addcabang.html')

@app.route('/cabangs', methods=['POST'])
def add_cabang():
    data = {
        "nama_cabang": request.form['nama_cabang'],
        "alamat_cabang": request.form['alamat_cabang'],
        "kota_cabang": request.form['kota_cabang'],
        "telp_cabang": request.form['telp_cabang'],
        "gambar_cabang": request.form['gambar_cabang']
    }
    requests.post('http://localhost:5002/cabangs/', json=data)
    return redirect(url_for('add_cabang_form'))

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
# @token_required
def add_menu_form():
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
    requests.post('http://localhost:5001/menuMiliKita/', json=data)
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
@app.route('/createOfficer/cabang/<int:id_cabang>', methods=['GET'])
def add_officer_form(id_cabang):
    cabangByID = get_cabangByID(id_cabang)
    return render_template('Karyawan/addkaryawan.html', cabang=cabangByID)

@app.route('/createOfficer/cabang/<int:id_cabang>', methods=['POST'])
def add_officer(id_cabang):
    data = {
        "nama_karyawan": request.form['nama_karyawan'],
        "id_cabang": id_cabang,
        "posisi_karyawan": request.form['posisi_karyawan'],
        "telp_karyawan": request.form['telp_karyawan'],
        "gambar_karyawan": request.form['gambar_karyawan']
    }
    requests.post('http://localhost:5003/karyawankita', json=data)
    return redirect(url_for('add_officer_form', id_cabang=id_cabang))

# hapus-karyawan


# REVIEW
# list-review (pilihan lihat semua/cabang/menu)

# detail-review
def getReviewById(id_review):
    response = requests.get(f'http://localhost:5000/reviews/{id_review}')
    return response.json()


@app.route('/ReviewByID/<int:id_review>', methods=['GET'])
def show_detailreview(id_review):
    ReviewByID = getReviewById(id_review)
    return render_template('Review/detailreview.html', review=ReviewByID)

# edit-review

# membuat-review
@app.route('/createReview/menu/<int:id_menu>', methods=['GET'])
def add_review_form(id_menu):
    menuByID = get_MenuByID(id_menu)
    allcabang = get_allCabang()
    return render_template('Review/addreview.html', menu=menuByID, cabangs=allcabang)

@app.route('/createReview/menu/<int:id_menu>', methods=['POST'])
def add_review(id_menu):
    data = {
        "pesan_review": request.form['pesan_review'],
        "id_cabang": request.form['id_cabang'],
        "id_menu": id_menu,
        "bintang_review": request.form['bintang_review']
    }
    requests.post('http://localhost:5000/review', json=data)
    return redirect(url_for('add_review_form', id_menu=id_menu))

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