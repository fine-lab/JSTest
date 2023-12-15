viewModel.get("button24mc") &&
  viewModel.get("button24mc").on("click", function (data) {
    // 填写回程信息--单击
    debugger;
    let currentRowData = viewModel.getGridModel().getRow(data.index);
    if (currentRowData.nhLeavestatus !== "2") {
      cb.utils.alert("状态有误,无法填写回程信息");
      return;
    }
    let data2 = {
      billtype: "Voucher", // 单据类型
      billno: "cgjhc", // 单据号，可通过预览指定页面后，在浏览器地址栏获取，在Voucher后面的字符串既是
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态edit + readOnly:true)
        readOnly: false, // 必填，否则调整到卡片页后，不调用默认的接口
        title: "还证页面",
        currentRowData: currentRowData
      }
    };
    cb.loader.runCommandLine("bill", data2, viewModel); // bill 打开列表弹窗
  });
viewModel.on("customInit", function (data) {
  // 出国境办理--页面初始化
  viewModel.on("afterLoadMeta", function (data) {
    // 隐藏一个主表字段
    debugger;
    viewModel.get("btnBizFlowBatchPush").setVisible(false);
  });
});