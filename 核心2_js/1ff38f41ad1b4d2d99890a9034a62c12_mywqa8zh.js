viewModel.get("button141jd") &&
  viewModel.get("button141jd").on("click", function (data) {
    // 弹--单击
    debugger;
    //获取选中行的行号
    var line = data.index;
    //获取选中行数据信息
    var gridModel = viewModel.getGridModel("orderDetails").getRow(line);
    // 物料id
    var productID = gridModel.productId;
    // 物料名称
    var productNAME = gridModel.productName;
    // 传递给被打开页面的数据信息
    let yy = {
      billtype: "VoucherList", // 单据类型
      billno: "3e39fece", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        productID: productID,
        productNAME: productNAME
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", yy, viewModel);
  });
viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").getEditRowModel() &&
  viewModel.get("orderDetails").getEditRowModel().get("productId_code") &&
  viewModel
    .get("orderDetails")
    .getEditRowModel()
    .get("productId_code")
    .on("afterValueChange", function (data) {
      debugger;
    });
viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").getEditRowModel() &&
  viewModel.get("orderDetails").getEditRowModel().get("productId_code") &&
  viewModel
    .get("orderDetails")
    .getEditRowModel()
    .get("productId_code")
    .on("blur", function (data) {
      debugger;
    });
viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").getEditRowModel() &&
  viewModel.get("orderDetails").getEditRowModel().get("realProductCode") &&
  viewModel
    .get("orderDetails")
    .getEditRowModel()
    .get("realProductCode")
    .on("valueChange", function (data) {
    });
viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").getEditRowModel() &&
  viewModel.get("orderDetails").getEditRowModel().get("realProductCode") &&
  viewModel
    .get("orderDetails")
    .getEditRowModel()
    .get("realProductCode")
    .on("afterValueChange", function (data) {
    });
var gridModel = viewModel.getGridModel("orderDetails");
gridModel.on("afterCellValueChange", function (data) {});
viewModel.get("button252xf") &&
  viewModel.get("button252xf").on("click", function (data) {
    //查看PLM--单击
    var currentRow = viewModel.getGridModel("orderDetails").getRow(data.index);
    window.YYCooperationBridge.YYFormFileGetAllListByObjectId([{ objectId: currentRow.productId, objectName: "iuap-apdoc-material" }], false, "", "", "", "", "").then((res) => {
      if (res.length > 0) {
        for (var a = 0; a < res.length; a++) {
          window.YYCooperationBridge.YYPreviewFileByIdV2({
            fileId: res[a].fileId,
            open: true
          }).then((res) => {
            console.log(res);
          });
        }
      }
    });
  });