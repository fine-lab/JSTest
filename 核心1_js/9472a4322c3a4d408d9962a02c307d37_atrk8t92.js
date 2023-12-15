viewModel.get("button26td") &&
  viewModel.get("button26td").on("click", function (data) {
    // 还证--单击
    debugger;
    let currentRowData = viewModel.getGridModel().getRow(data.index);
    if (currentRowData.nhLeavestatus === "3") {
      let data2 = {
        billtype: "Voucher", // 单据类型
        billno: "cgjsqglAlso", // 单据号，可通过预览指定页面后，在浏览器地址栏获取，在Voucher后面的字符串既是
        params: {
          mode: "add", // (编辑态edit、新增态add、浏览态edit + readOnly:true)
          readOnly: false, // 必填，否则调整到卡片页后，不调用默认的接口
          title: "还证页面",
          currentRowData: currentRowData
        }
      };
      cb.loader.runCommandLine("bill", data2, viewModel); // bill 打开列表弹窗
    } else {
      cb.utils.alert("不满足还证条件");
    }
  });
viewModel.get("button24ka") &&
  viewModel.get("button24ka").on("click", function (data) {
    // 取证--单击
    debugger;
    let currentRowData = viewModel.getGridModel().getRow(data.index);
    if (currentRowData.nhLeavestatus === "1") {
      let data2 = {
        billtype: "Voucher", // 单据类型
        billno: "Forensics", // 单据号，可通过预览指定页面后，在浏览器地址栏获取，在Voucher后面的字符串既是
        params: {
          mode: "add", // (编辑态edit、新增态add、浏览态edit + readOnly:true)
          readOnly: false, // 必填，否则调整到卡片页后，不调用默认的接口
          title: "取证页面",
          currentRowData: currentRowData
        }
      };
      cb.loader.runCommandLine("bill", data2, viewModel); // bill 打开列表弹窗
    } else {
      cb.utils.alert("不满足取证条件");
    }
  });
viewModel.get("cgsqgl_1567986019203547140") &&
  viewModel.get("cgsqgl_1567986019203547140").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    const actions = gridModel.getCache("actions");
    debugger;
  });