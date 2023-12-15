viewModel.get("requisitionDetail") &&
  viewModel.get("requisitionDetail").getEditRowModel() &&
  viewModel.get("requisitionDetail").getEditRowModel().get("quantity") &&
  viewModel
    .get("requisitionDetail")
    .getEditRowModel()
    .get("quantity")
    .on("valueChange", function (data) {
      // 数量--值改变
    });
viewModel.get("requisitionDetail") &&
  viewModel.get("requisitionDetail").getEditRowModel() &&
  viewModel.get("requisitionDetail").getEditRowModel().get("quantity") &&
  viewModel
    .get("requisitionDetail")
    .getEditRowModel()
    .get("quantity")
    .on("blur", function (data) {
      // 数量--失去焦点的回调
      console.log(data);
      var gridModel = viewModel.getGridModel();
      //获取表格当前页面所有的行数据
      const rowAllDatas = gridModel.getRows();
      //求和
      var sum = 0;
      for (var i = 0; i < rowAllDatas.length; i++) {
        console.log(rowAllDatas[i]);
        const row = rowAllDatas[i];
        if (row.quantity != undefined) {
          sum += row.quantity;
        }
      }
      //赋值
      viewModel.get("extend17").setValue(sum);
    });
viewModel.get("button62wc").on("click", function (data) {
  // 按钮--单击
  debugger;
  let data1 = {
    billtype: "Voucher", // 单据类型
    billno: "cbd6b46a", // 单据号
    domainKey: "yourKeyHere",
    params: {
      mode: "edit", // (卡片页面区分编辑态edit、新增态add、浏览态browse)
      id: "youridHere" //TODO:填写详情id
    }
  };
  //打开一个单据，并在当前页面显示
  cb.loader.runCommandLine("bill", data1, viewModel);
});
viewModel.on("customInit", function (data) {
  // 出库申请--页面初始化
});
viewModel.get("button62wc") &&
  viewModel.get("button62wc").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button125hi") &&
  viewModel.get("button125hi").on("click", function (data) {
    // 原厂跳转自建列表--单击
    debugger;
    let data2 = {
      billtype: "VoucherList", // 单据类型
      billno: "cbd6b46aList", // 单据号
      domainKey: "yourKeyHere"
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data2, viewModel);
  });
viewModel.get("button189ph") &&
  viewModel.get("button189ph").on("click", function (data) {
    // 原厂跳转原厂--单击
    let data3 = {
      billtype: "Voucher", // 单据类型
      billno: "st_purinrecord", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data3, viewModel);
  });
viewModel.get("button320wh") &&
  viewModel.get("button320wh").on("click", function (data) {
    // 原厂查询自建sql--单击
  });