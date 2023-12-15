viewModel.get("button18nh") &&
  viewModel.get("button18nh").on("click", function (args) {
    // 批量增加税号--单击
    //传递给被打开页面的数据信息
    debugger;
    console.log("11111111111");
    let data = {
      billtype: "VoucherList", // 单据类型
      billno: "14935257", // 单据号
      params: {
        mode: "browse" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });
viewModel.get("button22qh") &&
  viewModel.get("button22qh").on("click", function (data) {
    // 导出发票--单击
    invoiceToLargerCSV();
  });
viewModel.get("button27yg") &&
  viewModel.get("button27yg").on("click", function (data) {
    // 导出存货--单击
    stockToLargerCSV();
  });
viewModel.get("button33eg") &&
  viewModel.get("button33eg").on("click", function (data) {
    // 导出客户--单击
    customerToLargerCSV();
  });
// 发票导出
function invoiceToLargerCSV() {
  let columnTitle1 = [
    "FK",
    "KD_JENIS_TRANSAKSI",
    "FG_PENGGANTI",
    "NOMOR_FAKTUR",
    "MASA_PAJAK",
    "TAHUN_PAJAK",
    "TANGGAL_FAKTUR",
    "NPWP",
    "NAMA",
    "ALAMAT_LENGKAP",
    "JUMLAH_DPP",
    "JUMLAH_PPN",
    "JUMLAH_PPNBM",
    "ID_KETERANGAN_TAMBAHAN",
    "FG_UANG_MUKA",
    "UANG_MUKA_DPP",
    "UANG_MUKA_PPN",
    "UANG_MUKA_PPNBM",
    "REFERENSI"
  ];
  let columnTitle2 = ["LT", "NPWP", "NAMA", "JALAN", "BLOK", "NOMOR", "RT", "RW", "KECAMATAN", "KELURAHAN", "KABUPATEN", "PROPINSI", "KODE_POS", "NOMOR_TELEPON"];
  let columnTitle3 = ["OF", "KODE_OBJEK", "NAMA", "HARGA_SATUAN", "JUMLAH_BARANG", "HARGA_TOTAL", "DISKON", "DPP", "PPN", "TARIF_PPNBM", "PPNBM"];
  let colRow1 = [
    {
      FK: "FK",
      KD_JENIS_TRANSAKSI: "0",
      FG_PENGGANTI: "0",
      NOMOR_FAKTUR: "12240281651",
      MASA_PAJAK: "3",
      TAHUN_PAJAK: "2022",
      TANGGAL_FAKTUR: "11/03/2022",
      NPWP: "824475081044000",
      NAMA: "PT. INDO YUANHANG ENGINEERING",
      ALAMAT_LENGKAP: "RUKAN MANGGA DUA SQUARE BLOK F NO.35B JL GUNUNG SAHARI NO 1 ANCOL, PADEMANGAN JAKARTA UTARA PADEMANGAN JAKARTA UTARA DKI JAKARTA",
      JUMLAH_DPP: "402000",
      JUMLAH_PPN: "402000",
      JUMLAH_PPNBM: "0",
      ID_KETERANGAN_TAMBAHAN: "0",
      FG_UANG_MUKA: "0",
      UANG_MUKA_DPP: "0",
      UANG_MUKA_PPN: "0",
      UANG_MUKA_PPNBM: "0",
      REFERENSI: "SP/2022030632"
    }
  ];
  let colRow2 = [
    {
      LT: "OF",
      NPWP: "S10000",
      NAMA: "Non Warranty Services",
      JALAN: "250000",
      BLOK: "1",
      NOMOR: "250000",
      RT: "0",
      RW: "250000",
      KECAMATAN: "250000",
      KELURAHAN: "0",
      KABUPATEN: "0",
      PROPINSI: "",
      KODE_POS: "",
      NOMOR_TELEPON: ""
    }
  ];
  let colRow3 = [
    {
      OF: "OF",
      KODE_OBJEK: "S20000",
      NAMA: "Non Warranty - Non Services",
      HARGA_SATUAN: "1520000",
      JUMLAH_BARANG: "1",
      HARGA_TOTAL: "1520000",
      DISKON: "0",
      DPP: "1520000",
      PPN: "1520000",
      TARIF_PPNBM: "0",
      PPNBM: "0"
    }
  ];
  let exportStr = columnTitle1.join(",") + "\n";
  exportStr += columnTitle2.join(",") + "\n";
  exportStr += columnTitle3.join(",") + "\n";
  //具体数值 遍历
  for (let i = 0; i < colRow1.length; i++) {
    for (let item in colRow1[i]) {
      if (colRow1[i][item].indexOf(",") !== -1) {
        exportStr += `${'"' + colRow1[i][item] + '"' + "\t,"}`;
      } else {
        exportStr += `${colRow1[i][item] + "\t,"}`;
      }
    }
    exportStr += "\n";
    for (let item in colRow2[i]) {
      if (colRow2[i][item].indexOf(",") !== -1) {
        exportStr += `${'"' + colRow2[i][item] + '"' + "\t,"}`;
      } else {
        exportStr += `${colRow2[i][item] + "\t,"}`;
      }
    }
    exportStr += "\n";
    for (let item in colRow3[i]) {
      if (colRow3[i][item].indexOf(",") !== -1) {
        exportStr += `${'"' + colRow3[i][item] + '"' + "\t,"}`;
      } else {
        exportStr += `${colRow3[i][item] + "\t,"}`;
      }
    }
    exportStr += "\n";
  }
  var blob = new Blob([exportStr], { type: "text/plain;charset=utf-8" });
  //解决中文乱码问题
  blob = new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
  object_url = window.URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = object_url;
  link.download = "发票.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// 存货导出
function stockToLargerCSV() {
  let columnTitle = ["OB", "KODE_OBJEK", "NAMA", "HARGA_SATUAN"];
  let exportData = [
    {
      OB: "OB",
      KODE_OBJEK: "S10000",
      NAMA: "Non Warranty Services",
      HARGA_SATUAN: "2750000"
    },
    {
      OB: "OB",
      KODE_OBJEK: "S10000",
      NAMA: "Non Warranty - Non Services",
      HARGA_SATUAN: "1672000"
    }
  ];
  let exportStr = columnTitle.join(",") + "\n";
  //具体数值 遍历
  for (let i = 0; i < exportData.length; i++) {
    for (let item in exportData[i]) {
      if (exportData[i][item].indexOf(",") !== -1) {
        exportStr += `${'"' + exportData[i][item] + '"' + "\t,"}`;
      } else {
        exportStr += `${exportData[i][item] + "\t,"}`;
      }
    }
    exportStr += "\n";
  }
  var blob = new Blob([exportStr], { type: "text/plain;charset=utf-8" });
  //解决中文乱码问题
  blob = new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
  object_url = window.URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = object_url;
  link.download = "存货.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// 客户导出
function customerToLargerCSV() {
  let columnTitle = ["LT", "NPWP", "NAMA", "JALAN", "BLOK", "NOMOR", "RT", "RW", "KECAMATAN", "KELURAHAN", "KABUPATEN", "PROPINSI", "KODE_POS", "NOMOR_TELEPON"];
  let exportData = [
    {
      LT: "LT",
      NPWP: "824475081044000",
      NAMA: "PT. INDO YUANHANG ENGINEERING",
      JALAN: "JALAN",
      BLOK: "BLOK",
      NOMOR: "NOMOR",
      RT: "RT",
      RW: "RW",
      KECAMATAN: "KECAMATAN",
      KELURAHAN: "KELURAHAN",
      KABUPATEN: "KABUPATEN",
      PROPINSI: "PROPINSI",
      KODE_POS: "KODE_POS",
      NOMOR_TELEPON: "NOMOR_TELEPON"
    }
  ];
  let exportStr = columnTitle.join(",") + "\n";
  //具体数值 遍历
  for (let i = 0; i < exportData.length; i++) {
    for (let item in exportData[i]) {
      if (exportData[i][item].indexOf(",") !== -1) {
        exportStr += `${'"' + exportData[i][item] + '"' + "\t,"}`;
      } else {
        exportStr += `${exportData[i][item] + "\t,"}`;
      }
    }
    exportStr += "\n";
  }
  var blob = new Blob([exportStr], { type: "text/plain;charset=utf-8" });
  //解决中文乱码问题
  blob = new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
  object_url = window.URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = object_url;
  link.download = "客户.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}