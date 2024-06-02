const express = require('express');
const Menu = express();
const PORT = 3001;
const amqp = require('amqplib');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
    port: 3308
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connect to Database');
});

// let rabbitMQConnection;
// const queueName = "BookQueue";

Menu.use(express.urlencoded({ extended: false }));
Menu.use(express.json());

// CREATE
Menu.post('/menu', (req, res) => {
    const { id_menu, nama_menu, posisi_karyawan, deskripsi_menu, kategori_menu, gambar_menu } = req.body;
    const query = `INSERT INTO menu (id_menu, nama_menu, posisi_karyawan, deskripsi_menu, kategori_menu, gambar_menu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [id_menu, nama_menu, posisi_karyawan, deskripsi_menu, kategori_menu, gambar_menu], (err, result) => {
        if (err) {
            console.error('Error adding menu:', err);
            return res.status(500).send('Gagal masukin menu baru nich!');
        }
        res.send('ada menu baru nich!');
    });
});

// READ all menu
Menu.get('/menu', (req, res) => {
    db.query('SELECT * FROM menu', (err, rows) => {
        if (err) {
            console.error('Error fetching menu:', err);
            return res.status(500).send('Failed to fetch menu');
        }
        res.send(rows);
    });
});

// READ a specific book
Menu.get('/menu/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM menu WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching menu:', err);
            return res.status(500).send('Failed to fetch menu');
        }
        if (result.length === 0) {
            return res.status(404).send('Mohon maaf, kami tidak menyediakan menu enih!');
        }
        res.send(result[0]);
    });
});


// UPDATE
Menu.put('/menu/:id', (req, res) => {
    const { id } = req.params;
    const { menu } = req.body;
    const query = `UPDATE menu SET content = ? WHERE id = ?`;

    db.query(query, [menu, id], (err, result) => {
        if (err) {
            console.error('Error updating menu:', err);
            return res.status(500).send('Failed to update menu');
        }
        res.send('Menu sudah di update!');
    });
});

// DELETE
Menu.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM menu WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting menu:', err);
            return res.status(500).send('Failed to delete menu');
        }
        res.send('Menu sudah dihapus!');
    });
});



// async function listenMenu() {
//     try {
//         const channel = await rabbitMQConnection.createChannel();
//         await channel.assertQueue(queueName, { durable: false });
//         channel.consume(queueName, (book) => {
//             if (book !== null) {
//                 const receivedJSON = JSON.parse(book.content.toString());
//                 console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
//                 // Simpan buku ke dalam database di sini
//                 const query = `INSERT INTO books (content) VALUES (?)`;
//                 db.query(query, [receivedJSON], (err, result) => {
//                     if (err) {
//                         console.error('Error adding book:', err);
//                         // Tambahkan penanganan kesalahan di sini jika diperlukan
//                     }
//                 });
//                 channel.ack(book);
//             }
//         });
//     } catch (error) {
//         console.error('Error in listenBook:', error);
//         // Tambahkan penanganan kesalahan di sini jika diperlukan
//     }
// }

// amqp.connect('amqp://localhost').then(async (connection) => {
//     rabbitMQConnection = connection;
//     listenBook().catch(error => {
//         console.error('Error in initial listenBook:', error);
//         // Tambahkan penanganan kesalahan di sini jika diperlukan
//     });

//     app.listen(PORT, () => {
//         console.log(` 😀 server on port ${PORT}  `);
//     });
// });

// // Jangan lupa untuk menutup koneksi RabbitMQ setelah selesai menggunakan.
// process.on('SIGINT', () => {
//     rabbitMQConnection.close();
//     console.log('RabbitMQ connection closed');
//     process.exit(0);
// });
