async function loadDoTracking() {
  try {
    const response = await fetch("./templates/do-tracking.html");
    const templateHtml = await response.text();

    Vue.component("do-tracking", {
      template: templateHtml,
      props: ["databaseTracking", "listEkspedisi", "listPaket"],
      data() {
        return {
          inputDO: "",
          hasilPencarian: null,
          pesanError: "",
          // databaseTracking: app.tracking,

          // listEkspedisi: app.pengirimanList,
          // listPaket: app.paket,
          daftarDO: [],

          form: {
            noDO: "",
            nim: "",
            nama: "",
            ekspedisi: "",
            kodePaket: "",
            tanggalKirim: new Date().toISOString().substring(0, 10),
          },
        };
      },
      watch: {
        inputDO: function (nilaibaru) {
          console.log("ini nilai do", nilaibaru);
          if (nilaibaru == "") {
            this.resethasilPencarian();
          }
        },
      },
      computed: {
        paketTerpilih() {
          if (!this.form.kodePaket) return null;
          return this.listPaket.find((p) => p.kode === this.form.kodePaket);
        },
      },
      mounted() {
        this.generateNomorDO();
      },
      methods: {
        resethasilPencarian() {
          this.hasilPencarian = null;
        },
        cariDO() {
          this.hasilPencarian = null;
          this.pesanError = "";

          if (this.inputDO.trim() === "") {
            this.pesanError = "Silakan masukkan Nomor Delivery Order!";
            return;
          }

          console.log("Kata kunci yang dicari:", this.inputDO);
          console.log("Isi databaseTracking saat ini:", this.databaseTracking);

          //const dataKetemu = this.databaseTracking[this.inputDO];
          // dataKetemu = this.databaseTracking.find(item => item.noDO === this.inputDO);

          let dataKetemu = null;

          if (Array.isArray(this.databaseTracking)) {
            dataKetemu = this.databaseTracking.find(
              (item) => item.noDO === this.inputDO,
            );
          } else {
            dataKetemu = this.databaseTracking[this.inputDO];
          }

          console.log("ini data", dataKetemu);
          if (dataKetemu) {
            this.hasilPencarian = dataKetemu;
          } else {
            console.log("masuk mbah");
            this.pesanError = `Data dengan nomor ${this.inputDO} tidak ditemukan.`;
          }
        },

        generateNomorDO() {
          const tahun = new Date().getFullYear();
          const sequence = this.daftarDO.length + 1;
          const sequenceStr = String(sequence).padStart(4, "0");
          this.form.noDO = `DO${tahun}-${sequenceStr}`;
        },

        simpanDO() {
          if (
            !this.form.nim ||
            !this.form.nama ||
            !this.form.ekspedisi ||
            !this.form.kodePaket
          ) {
            alert("Mohon lengkapi seluruh isian form!");
            return;
          }

          const dataBaru = {
            nim: this.form.nim,
            nama: this.form.nama,
            status: "Diproses",
            ekspedisi: this.form.ekspedisi,
            tanggalkirim: this.form.tanggalKirim,
            paket: this.form.kodePaket,
            total: this.paketTerpilih.harga,
            perjalanan: [
              {
                waktu: new Date()
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 19),
                keterangan: "DO diterbitkan dan sedang diproses admin.",
              },
            ],
          };

          this.databaseTracking[this.form.noDO] = dataBaru;
          this.daftarDO.push({ noDO: this.form.noDO });

          alert(`Berhasil! Delivery Order ${this.form.noDO} telah disimpan.`);

          this.form.nim = "";
          this.form.nama = "";
          this.form.ekspedisi = "";
          this.form.kodePaket = "";

          this.generateNomorDO();
        },
      },
    });
    console.log("--> Komponen do-tracking sukses dimuat!");
  } catch (error) {
    console.error("Error saat loadDoTracking:", error);
  }
}
