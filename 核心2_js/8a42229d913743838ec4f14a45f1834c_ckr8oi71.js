viewModel.get("button22te") &&
  viewModel.get("button22te").on("click", function (data) {
    // 生成出入库--单击
    debugger;
    var newIntervalDate = new Date();
    var year = newIntervalDate.getFullYear();
    var month = newIntervalDate.getMonth() + 1 < 10 ? "0" + (newIntervalDate.getMonth() + 1) : newIntervalDate.getMonth() + 1;
    var newdates = year + "-" + month;
    var resl = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.dailyInventApi", { date: newdates }, function (err, res) {}, viewModel, { async: false });
    if (resl.error) {
      cb.utils.alert("错误原因:" + resl.error.message);
      return;
    }
    if (resl.result.Inwarehouse.code === "200" && resl.result.Outwarehouse.code === "200") {
      cb.utils.alert("本月出入库数据生成成功");
    }
  });