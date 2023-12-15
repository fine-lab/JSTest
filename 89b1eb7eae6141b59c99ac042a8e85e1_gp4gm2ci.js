var gridModel = viewModel.getGridModel();
gridModel.on("masterTableRowClick", function (index) {
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "ybc2a3b322", // 单据号
    params: {
      readOnly: true, // 预览时，一定为true，否则不加载详情数据
      mode: "browse", // 须传mode + 单据id + readOnly:false
      id: gridModel.getEditRowModel().getAllData().id
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
});