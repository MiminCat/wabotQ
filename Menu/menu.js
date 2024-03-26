// menu.js

let senderMenuPrompts = {}; // Menyimpan informasi apakah pengguna sudah menerima prompt atau belum

module.exports = {
    handleMenu: async function(socket, chat) {
        const pesan = chat.message?.extendedTextMessage?.text ?? chat.message?.ephemeralMessage?.message?.ext;
        const sender = chat.key.remoteJid;

        // Jika pesan adalah '.ping'
        if (pesan === '.ping') {
            await socket.sendMessage(sender, { text: "Hello World.", quoted: chat });
            await socket.sendMessage(sender, { text: "Hello World2." });
            await socket.sendMessage(sender, { text: "Pong ! ping *Good* !! have nice day ^_^" });

        // Jika pesan adalah '.menu'
        } else if (pesan === '.menu') {
            const menuText = "Pilihan menu:\n*(1)* => Shopp 🏷️\n*(2)* => All Menu ⚙️";
            await socket.sendMessage(sender, { text: menuText });

            // Set informasi bahwa pengguna sudah menerima prompt menu
            senderMenuPrompts[sender] = true;

        // Jika pesan adalah '.shop'
        } else if (pesan === '.shop') {
            const shopMenuText = "Pilihan menu shop:\n*(1)* => Order 🛒\n*(2)* => Info ℹ️\n*(0)* => Kembali ke menu";
            await socket.sendMessage(sender, { text: shopMenuText });

            // Tidak perlu mengubah informasi bahwa pengguna menerima prompt karena masih berada di menu shop

        // Jika pesan acak dan pengguna belum menerima prompt menu
        } else if (!senderMenuPrompts[sender] && pesan) {
            const randomText = "Hai! Ketikkan '.menu' untuk menampilkan menu.";
            await socket.sendMessage(sender, { text: randomText });

            // Set informasi bahwa pengguna sudah menerima prompt menu
            senderMenuPrompts[sender] = true;
        }
    }
};
