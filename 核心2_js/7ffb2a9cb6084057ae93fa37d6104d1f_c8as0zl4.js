viewModel.get("button88td") &&
  viewModel.get("button88td").on("click", function (data) {
    // 云条码打印--单击
    const orgid = viewModel.get("org").getValue();
    const billid = viewModel.get("id").getValue();
    const billno = viewModel.get("code").getValue();
    const vendor = viewModel.get("vendor").getValue();
    const vendor_name = viewModel.get("vendor_name").getValue();
    let printdata = viewModel.get("purInRecords").getSelectedRows();
    if (printdata == null || printdata.length == 0) {
      printdata = viewModel.get("purInRecords").getRows();
    }
    window.jDiwork.openService(
      "18802b06-6f16-4674-bfe1-80b6bb4b0716",
      {},
      { data: { bt: "采购入库", billid: billid, billno: billno, orgid: orgid, vendor: vendor, vendor_name: vendor_name, alldata: printdata } }
    );
  });