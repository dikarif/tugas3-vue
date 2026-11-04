const ApiService = {
  async getBahanAjar() {
    try {
      const response = await fetch("./data/dataBahanAjar.json");
      if (!response.ok) {
        throw new Error("Gagal memuat data dari dataBahanAjar.json");
      }
      return await response.json();
    } catch (error) {
      console.error("Error API Service:", error);
      return null;
    }
  },
};
