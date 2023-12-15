var detailData = null;
function loadBill(billtype, billno, mode, id = null, data = null, domainKey = "yourKeyHere") {
  let info = {
    billtype: billtype, // 单据类型
    billno: billno, // 单据号
    domainKey: domainKey,
    params: {
      mode: mode
    }
  };
  if (data) info.params["data"] = data;
  if (id) info.params["id"] = id;
  cb.loader.runCommandLine("bill", info, viewModel);
}
viewModel.get("btnAddRowAddress") &&
  viewModel.get("btnAddRowAddress").on("click", function (data) {
    // 增加地址--单击
    loadBill("voucher", "5f6f4f93", "add");
  });
viewModel.on("afterSave", function (args) {});
viewModel.on("customInit", function (data) {
  console.log("customInit----------------------");
  console.log(data);
});
viewModel.on("afterLoadMeta", function (data) {
  console.log("afterLoadMeta---------------");
  console.log(data);
  viewModel.get("name").setPrevValue("历史数据");
});
viewModel.on("beforeEdit", function (args) {
  console.log("beforeEdit---------------");
  console.log(args);
});
viewModel.on("afterEdit", function (args) {
  console.log("afterEdit---------------");
  console.log(args);
});
viewModel.on("afterJointquery", function (args) {
  console.log("afterJointquery---------------");
  debugger;
});
viewModel.on("afterLoadData", function (data) {
  console.log("afterLoadData---------------");
  if (detailData) {
    viewModel.setData(detailData); //getGridModel().setDataSource(detailData.AddressList);
  }
  detailData = null;
});
viewModel.get("btnEdit") &&
  viewModel.get("btnEdit").on("click", function (data) {
    // 编辑--单击
    detailData = viewModel.getAllData();
    for (var item in detailData.AddressList) {
      detailData.AddressList[item]._status = "Insert";
    }
    viewModel.biz.do("add", viewModel);
  });
viewModel.get("button23le") &&
  viewModel.get("button23le").on("click", function (data) {
    // 编辑--单击
  });
viewModel.get("btnCopyRowAddress") &&
  viewModel.get("btnCopyRowAddress").on("click", function (data) {
    // 编辑2--单击
    let gm = viewModel.getGridModel();
    let row = gm.getRow(gm.getFocusedRowIndex());
    loadBill("voucher", "5f6f4f93", "edit", null, row);
  });