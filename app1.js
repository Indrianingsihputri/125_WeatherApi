const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {
    const kota = "jakarta";

    const apiKey = "TmW3n2IbOKaZxkghOoYB";

    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);

        const data = response.data;

        // Memastikan data lokasi ditemukan
        if (!data.features || data.features.length === 0) {
            return res.status(404).json({
                message: "Lokasi tidak ditemukan"
            });
        }

        // Mengambil koordinat
        const feature = data.features[0];
        const koordinat = feature.geometry.coordinates;

        const longitude = koordinat[0];
        const latitude = koordinat[1];

        const lokasi = data.features[0].matching_text;
        const koordinat = data.features[0].geometry.coordinates;

        res.json({
            kota: lokasi,
            koordinat : koordinat,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan
        });

         // Variabel wilayah
        let negara = "-";
        let provinsi = "-";
        let kecamatan = "-";


        // Membaca context dari MapTiler
        if (feature.context) {
            feature.context.forEach((item) => {

                if (item.id.startsWith("country")) {
                    negara = item.text;
                }

                if (
                    item.id.startsWith("state") ||
                    item.id.startsWith("region")
                ) {
                    provinsi = item.text;
                }

                if (
                    item.id.startsWith("district") ||
                    item.id.startsWith("county")
                ) {
                    kecamatan = item.text;
                }
            });
        }

    }catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "gagal mengambil data dari MapTiler" 
        });

    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});