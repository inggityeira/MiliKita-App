<p align="center"><img src="https://telkomuniversity.ac.id/wp-content/uploads/2019/03/Logo-Telkom-University-png-3430x1174.png" width="370" alt="Logo Telkom University"></p>

# Tentang MiliKita

🍵 MiliKita adalah website coffee shop berbasis microservice yang dirancang untuk memudahkan pemilik dalam mengelola berbagai aspek dari bisnis mereka, termasuk cabang, karyawan, menu, ulasan, dan aktivitas di dalam website.

# Workflow
<img src="Workflow.png" />

# Anggota Kelompok 3 SI4502

| No  | Nama                                                            | NIM        |
| --- | --------------------------------------------------------------- | ---------- |
| 1   | [Inggit Yeira Budi Agranata](https://www.instagram.com/inggityrba)    | 1202213238 |
| 2   | [Laura Tsanaullailla](https://www.instagram.com/lauratsna)             | 1202210076 |
| 3   | [Nadya Sri Andriani](https://www.instagram.com/nadyasaaa__) | 1202213060 |
| 4   | [Nikita Gradiana Shahiesa](https://www.instagram.com/nikitagradianas)     | 1202213312

# Cara Instalasi dan Penggunaan
1. Clone repository ini:
```bash https://github.com/inggityeira/MiliKita-App```
2. Install dependencies:
    a.	Install flask 
        Flask adalah sebuah microframework untuk membangun aplikasi web dengan Python.
    b.	Install Jwt
        PyJWT adalah pustaka untuk bekerja dengan JSON Web Tokens (JWT) di Python.
    c.	Install flask_paginate.
        Flask-Paginate adalah pustaka untuk menambahkan fitur paginati pada aplikasi web yang dibangun dengan Flask.
3. Jalankan Aplikasi
    > Perintah docker-compose up --build digunakan dalam Docker Compose untuk menjalankan dan membangun kembali layanan-layanan yang ada dalam berkas docker-compose.yml.
    ```bash docker-compose up –build ```
    > Perintah python main.py digunakan untuk menjalankan sebuah program Python yang ada di dalam berkas main.py
                ```bash pyhton main.py```


# Fitur MiliKita
| Fitur                    | Deskripsi                                                                                                     |
|--------------------------|---------------------------------------------------------------------------------------------------------------|
| **Manajemen Cabang**     | - Menambah, mengedit, dan menghapus cabang MiliKita<br>- Melihat informasi lengkap setiap cabang (nama, lokasi, telpon, dan gambar cabang)       |
| **Manajemen Karyawan**   | - Menambah, mengedit, dan menghapus karyawan MiliKita<br>- Melihat informasi lengkap setiap karyawan (nama, posisi, telpon, dan gambar karyawan)  |
| **Manajemen Menu**       | - Menambah, mengedit, dan menghapus Menu MiliKita<br>- Melihat informasi lengkap setiap menu (nama menu, deskripsi menu, kategori menu, dan gambar menu)  |
| **Manajemen Review**     | - Menambah, mengedit, dan menghapus review MiliKita<br>- Melihat informasi dari seluruh review (pesan review dari setiap cabang dan menu serta bintang review) |
| **Manajemen Aktivitas User** | - Memantau aktivitas yang dilakukan ketika membuka website<br>- Memvisualisasikan dalam bentuk chart aktivitas dari user                             |
