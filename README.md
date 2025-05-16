# Peta Batas Wilayah & Risiko Longsor Di Kota Bogor

Aplikasi web interaktif untuk menampilkan peta batas wilayah Kota Bogor dan perhitungan risiko longsor menggunakan metode Fuzzy Logic.

## Struktur Folder

```
bogor-landslide-risk/
├── assets/
│   ├── css/          # File stylesheet
│   │   └── styles.css
│   ├── js/           # File JavaScript
│   │   ├── fuzzy_logic.js
│   │   └── script.js
│   └── data/         # Data GeoJSON
│       ├── bogor-city.geojson
│       └── bogor-boundary.geojson
├── scripts/          # Script pembantu
│   └── filter_geojson.py
├── index.html        # Halaman utama
├── README.md         # Dokumentasi
└── .gitignore
```

## Fitur

- Peta interaktif batas wilayah Kota Bogor
- Pemilihan Kecamatan dan Kelurahan
- Perhitungan risiko longsor menggunakan Fuzzy Logic
- Visualisasi hasil perhitungan dengan grafik
- Rekomendasi berdasarkan tingkat risiko
- Tampilan responsif untuk desktop dan mobile

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript
- Leaflet.js untuk peta interaktif
- Chart.js untuk visualisasi data
- Font Awesome untuk ikon
- Google Fonts

## Cara Penggunaan

1. Pilih Kecamatan dari dropdown menu
2. Pilih Kelurahan dari dropdown menu
3. Masukkan data untuk perhitungan risiko longsor:
   - Curah hujan (mm/tahun)
   - Ketinggian tanah (mdpl)
   - Kemiringan tanah (derajat)
   - Tutupan tanah
4. Klik tombol "Hitung Fuzzy Logic"
5. Lihat hasil perhitungan dan rekomendasi

## Instalasi Lokal

1. Clone repository ini
```bash
https://github.com/dafahuda/bogor-landslide-risk.git
```

2. Buat folder sesuai struktur di atas
3. Pindahkan file ke folder yang sesuai
4. Buka file `index.html` di browser

## Demo

Aplikasi dapat diakses online di: https://dafahuda.github.io/bogor-landslide-risk/

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan:
1. Fork repository
2. Buat branch baru
3. Commit perubahan Anda
4. Push ke branch
5. Buat Pull Request

## Lisensi

MIT License 
