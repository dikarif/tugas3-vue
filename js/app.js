async function startAplikasi() {
  await loadStockTable();
  await loadDoTracking();

  new Vue({
    el: "#app",
    data: {
      tab: "stok",
      dropdownBuka: false,
      state: {
        stok: [],
        upbjjList: [],
        kategoriList: [],

        tracking: {},
        listEkspedisi: [],
        listPaket: [],
      },
    },
    async created() {
      const data = await ApiService.getBahanAjar();

      if (data) {
        this.state.stok = data.stok;
        this.state.upbjjList = data.upbjjList;
        this.state.kategoriList = data.kategoriList;

        this.state.tracking = data.tracking[0] || {};
        this.state.listEkspedisi = data.pengirimanList || {};
        this.state.listPaket = data.paket || {};

        console.log("Data JSON berhasil dimuat ke state:", data);
      } else {
        console.error("Data gagal dimuat dari ApiService.");
      }
    },
  });
}

startAplikasi();
