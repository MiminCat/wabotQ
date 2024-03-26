const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { handleMenu } = require('./Menu/menu.js');

// Deklarasi objek sock untuk pengiriman pesan
let sock;

async function connectWhatsApp() {
    console.log("\x1b[32m" + // Warna hijau
        " __  __ _           _          _____      _   \n" +
        "|  \\/  (_)         (_)        / ____|    | |  \n" +
        "| \\  / |_ _ __ ___  _ _ __   | |     __ _| |_ \n" +
        "| |\\/| | | '_ ` _ \\| | '_ \\  | |    / _` | __|\n" +
        "| |  | | | | | | | | | | | | | |___| (_| | |_ \n" +
        "|_|  |_|_|_| |_| |_|_|_| |_|  \\_____|\\__,_|\\__|\n" +
        "\x1b[0m" + // Kembali ke warna standar
        "\x1b[33m" + // Warna kuning
        "\x1b[1m" + // Mode cetak tebal (font bold)
        "------------ Selamat datang di wabotQ ----------\n" + // Tulisan "Selamat datang di wabotQ" dengan warna kuning dan teks tebal
        "\x1b[0m" + // Kembali ke warna standar
        "\x1b[3m" + // Mode cetak miring (font italic)
        "\nNb: Semisal Qr code nya gak kelihatan atau berantakan coba di zoom out sampai benar benar kelihatan normal\n" + // Tulisan tambahan dengan format miring
        "\x1b[0m" + // Kembali ke format teks standar
        "\nTips: 1. Kalau ingin keluar, klik Ctrl + C" + //tips 1
        "\nTips: 2. Untuk mengganti device atau mengakhiri sesi, hapus dulu file 'session' dengan perintah rm -rf session" //tips 2
    );

    try {

        const auth = await useMultiFileAuthState("session");

        const socket = makeWASocket({
            printQRInTerminal: true,
            browser: ["wabotQ", "MiminCat", "1.0.0"],
            auth: auth.state,
            logger: pino({ level: "silent" })
        });

        // Simpan socket ke dalam variabel sock
        sock = socket;

        socket.ev.on("creds.update", auth.saveCreds);

        // Menyimpan status koneksi saat ini
        let connectionStatus = "close";
        socket.ev.on("connection.update", async ({ connection }) => {
            if (connection === "open") {
                console.log("\x1b[1m\x1b[31m%s\x1b[0m", "BOT WHATSAPP SIAP DIGUNAKAN :) ");
                connectionStatus = "open";
            } else if (connection === "close") {
                console.log("Koneksi terputus, mencoba untuk melakukan koneksi ulang...");
                connectionStatus = "close";

                console.log("\x1b[3m" + // Mode cetak miring (font italic)
                    "\x1b[1m" +
                    "\x1b[95m" +
                    "pastikan terhubung ke jaringan internet" + // Teks tambahan dengan format miring
                    "\x1b[0m" // Kembali ke format teks standar
                );
                console.log("\x1b[34m%s\x1b[0m", "bila sudah terhubung sebelumnya mungkin anda \x1b[37mkeluar\x1b[0m /LogOut \x1b[34m  Dari Lingked device di Whatsapp, pastikan juga anda menghapus folder \x1b[37msession\x1b[0m");
                let countDown = 5;
                const interval = setInterval(() => {
                    console.log(`Mencoba koneksi ulang dalam ${countDown} detik...`);
                    countDown--;
                    if (countDown === 0) {
                        clearInterval(interval); // Hentikan interval setelah hitungan mundur selesai
                        connectWhatsApp(); // Mulai koneksi ulang
                    }
                }, 1000);
            }
        });

        // Membuat test koneksi terhubung nggak nya
        // Menangani pesan yang masuk
        socket.ev.on("messages.upsert", async ({ messages }) => {
            const chat = messages[0];
            const nohp = messages[0].key;
            await handleMenu(socket, chat, nohp); // Menjalankan fungsi handleMenu untuk menangani pesan
        });
        
    } catch (error) {
        console.error('Gagal membuat koneksi:', error);
    }
}

// Mulai proses koneksi
connectWhatsApp();
