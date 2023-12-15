viewModel.get("button11te") &&
  viewModel.get("button11te").on("click", function (data) {
    // 按钮--单击
    let viewModel = cb.cache.get("views");
    debugger;
    let selectedRows = viewModel.getGridModels()[0].getSelectedRows();
    if (selectedRows.length !== 1) {
      cb.utils.alert("只能选择一行");
      return;
    }
    let data1 = {
      billtype: "Voucher", // 单据类型
      billno: "ee2fe6da", // 单据号，可通过预览指定页面后，在浏览器地址栏获取，在Voucher后面的字符串既是
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态edit + readOnly:true)
        readOnly: false, // 必填，否则调整到卡片页后，不调用默认的接口,
        medals: selectedRows[0],
        applicable_dept: selectedRows[0].applicable_dept
      }
    };
    cb.loader.runCommandLine("bill", data1, viewModel); // bill 打开列表弹窗
  });
viewModel.on("customInit", function (data) {
  // 部门勋章管理--页面初始化
  debugger;
  cb.cache.set("views", data);
});