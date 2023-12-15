viewModel.get("button66mg") &&
  viewModel.get("button66mg").on("click", function (data) {
    // 云条码打印--单击
    const orgid = viewModel.get("org").getValue();
    const billid = viewModel.get("id").getValue();
    const billno = viewModel.get("code").getValue();
    let printdata = viewModel.get("storeProRecords").getSelectedRows();
    if (printdata == null || printdata.length == 0) {
      printdata = viewModel.get("storeProRecords").getRows();
    }
    window.jDiwork.openService("18802b06-6f16-4674-bfe1-80b6bb4b0716", {}, { data: { bt: "产品入库", billid: billid, billno: billno, orgid: orgid, alldata: printdata } });
  });