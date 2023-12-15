var highRiskMatters = [];
var gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", (data) => {
  const res = cb.rest.invokeFunction("db0e4a808eda4a81988f5514b218312a", {}, null, gridModel, { async: false });
  if (res && res.result && res.result.request) {
    highRiskMatters = res.result.request;
  }
  if (data.length > 0) {
    data.forEach((da, index) => {
      var productDescIndex = da.productDesc;
      var tag = 0;
      if (productDescIndex) {
        for (var i = 0; i < highRiskMatters.length; i++) {
          tag = productDescIndex.indexOf(highRiskMatters[i].name);
          if (tag > -1) {
            break;
          }
        }
        if (tag > -1) {
          gridModel.setCellValue(index, "item251ed", "🈲");
        }
      }
    });
  }
});
viewModel.get("button40rh") &&
  viewModel.get("button40rh").on("click", function () {
    // 生成合同--单击
    const rows = viewModel.getGridModel().getSelectedRows();
    if (!rows || rows.length == 0) {
      cb.utils.alert("请勾选有效数据!", "error");
      return;
    }
    let isContinue = true;
    rows.forEach((item) => {
      if (item.ecProcessStatus == "19") {
        isContinue = false;
      }
    });
    if (!isContinue) {
      cb.utils.alert("单据已生成合同,不可重复生成!", "error");
      return;
    }
    let data = {
      billtype: "Archive", // 单据类型
      billno: "yccontract", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态browse)
        readOnly: false,
        reqDatas: rows
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel); // bill 打开列表弹窗
  });