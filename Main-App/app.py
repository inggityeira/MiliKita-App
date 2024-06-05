from flask import Flask, render_template, jsonify, request, redirect, url_for
import requests

app = Flask(__name__)

#fitur detail menu

def get_menu(id_menu):
    response = requests.get(f'http://localhost:5001/menusMiliKita/{id_menu}')
    return response.json()

#Fitur Add Menu
@app.route('/menuMiliKita', methods=['GET'])
def add_menu_form():
    return render_template('addmenu.html')

@app.route('/menuMiliKita', methods=['POST'])
def add_menu():
    data = {
        "idmenu": request.form['idmenu'],
        "nama_menu": request.form['nama_menu'],
        "kategori_menu": request.form['kategori_menu'],
        "position": request.form['position'],
        "deskripsi_menu": request.form['deskripsi_menu']
    }
    response = requests.post('http://localhost:5001/menuMiliKita/', json=data)
    return redirect(url_for('add_menu_form'))

#Fitur Add Karyawan
@app.route('/karyawankita', methods=['GET'])
def add_karyawan_form():
    return render_template('addkaryawan.html')

@app.route('/karyawankita', methods=['POST'])
def add_karyawan():
    data = {
        "idkaryawan": request.form['idkaryawan'],
        "nama_karyawan": request.form['nama_karyawan'],
        "idcabang": request.form['idcabang'],
        "posisi_karyawan": request.form['posisi_karyawan'],
        "telp_karyawan": request.form['telp_karyawan']
    }
    response = requests.post('http://localhost:5003/karyawankita/', json=data)
    return redirect(url_for('add_karyawan_form'))

#Fitur Add Cabang
@app.route('/cabangs', methods=['GET'])
def add_cabang_form():
    return render_template('addcabang.html')

@app.route('/cabangs', methods=['POST'])
def add_cabang():
    data = {
        "idcabang": request.form['idcabang'],
        "nama_cabang": request.form['nama_cabang'],
        "alamat_cabang": request.form['alamat_cabang'],
        "kota_cabang": request.form['kota_cabang'],
        "telp_cabang": request.form['telp_cabang']
    }
    response = requests.post('http://localhost:5002/cabangs/', json=data)
    return redirect(url_for('add_cabang_form'))

#Fitur Add Review
@app.route('/reviews', methods=['GET'])
def add_review_form():
    return render_template('addreview.html')

@app.route('/reviews', methods=['POST'])
def add_review():
    data = {
        "idreview": request.form['idreview'],
        "pesan_review": request.form['pesan_review'],
        "idcabang": request.form['idcabang'],
        "idmenu": request.form['idmenu'],
        "iduser": request.form['iduser'],
        "bintang_review": request.form['bintang_review']
    }
    response = requests.post('http://localhost:5000/reviews/', json=data)
    return redirect(url_for('add_review_form'))

# Fungsi memanggil list menu
def get_list_menu():
    response = requests.get(f'http://localhost:5001/menusMiliKita')
    return response.json()

@app.route('/menusMiliKita', methods=['GET'])
def listmenu():
    listMenu = get_list_menu()
    return render_template('listmenu.html', listMenu = listMenu)

# Fungsi memanggil list karyawan
def get_list_karyawan():
    response = requests.get(f'http://localhost:5003/karyawakita')
    return response.json()

@app.route('/karyawankita', methods=['GET'])
def listkaryawan():
    listKaryawan = get_list_karyawan()
    return render_template('listkaryawan.html', listKaryawan = listKaryawan)

# Fungsi memanggil list cabang
def get_list_cabang():
    response = requests.get(f'http://localhost:5002/cabang')
    return response.json()

@app.route('/cabang', methods=['GET'])
def listcabang():
    listCabang = get_list_cabang()
    return render_template('listcabang.html', listCabang = listCabang)

# Fungsi memanggil list review
def get_list_review():
    response = requests.get(f'http://localhost:5000/review')
    return response.json()

@app.route('/review', methods=['GET'])
def listreview():
    listReview = get_list_menu()
    return render_template('listreview.html', listReview = listReview)

# Fitur menghapus menu
@app.route('/menuMiliKita/<int:id_menu>', methods=['GET'])
def delete_menu(id_menu):
    response = requests.delete(f'http://localhost:5001/delete/{id_menu}')
    if response.status_code == 200:
        return redirect(url_for('listmenu'))
    else:
        return "Error: Unable to delete menu.", 400

# Fitur menghapus karyawan
@app.route('/karyawankita/<int:id_karyawan>', methods=['GET'])
def delete_karyawan(id_karyawan):
    response = requests.delete(f'http://localhost:5003/delete/{id_karyawan}')
    if response.status_code == 200:
        return redirect(url_for('listkaryawan'))
    else:
        return "Error: Unable to delete officer.", 400
    
# Fitur menghapus cabang
@app.route('/cabang/<int:id_cabang>', methods=['GET'])
def delete_cabang(id_cabang):
    response = requests.delete(f'http://localhost:5002/delete/{id_cabang}')
    if response.status_code == 200:
        return redirect(url_for('listcabang'))
    else:
        return "Error: Unable to delete store.", 400
    
# Fitur menghapus review
@app.route('/review/<int:id_review>', methods=['GET'])
def delete_review(id_review):
    response = requests.delete(f'http://localhost:5000/delete/{id_review}')
    if response.status_code == 200:
        return redirect(url_for('listreview'))
    else:
        return "Error: Unable to delete review.", 400
    

if __name__=="__main__":
    app.run(debug=True, port=5006)

    
