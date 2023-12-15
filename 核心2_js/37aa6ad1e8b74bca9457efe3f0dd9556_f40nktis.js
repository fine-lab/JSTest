viewModel.on("customInit", function (data) {
  console.info("高尓夫尊（北京）科技有限公司 销售合同 扩展加载！");
  //合同标的
  let gridModel = viewModel.get("childs");
  viewModel.on("afterLoadData", function () {
    let mode = viewModel.getParams().mode;
    if ("add" == mode && cb.rest.interMode == "mobile" && !gridModel.getRows()?.length) {
      gridModel.appendRow({});
    }
  });
});