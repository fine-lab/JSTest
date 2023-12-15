viewModel.get("TimeInterval") &&
  viewModel.get("TimeInterval").on("afterValueChange", function (data) {
    // 时间区间--值改变后
    debugger;
    viewModel.getGridModel().clear();
    var IntervalDate = viewModel.get("TimeInterval").getValue();
    var newIntervalDate = new Date(IntervalDate);
    var year = newIntervalDate.getFullYear();
    var month = newIntervalDate.getMonth() + 1 < 10 ? "0" + (newIntervalDate.getMonth() + 1) : newIntervalDate.getMonth() + 1;
    var newdates = year + "-" + month;
    var resl = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.updStage", { date: newdates }, function (err, res) {}, viewModel, { async: false });
    if (resl.error) {
      cb.utils.alert("错误原因:" + resl.error.message);
      return;
    }
    var totalValue = resl.result.AllRes;
    var moneyvalue = resl.result.money;
    var tolvalue = resl.result.tolValue;
    for (var i = 0; i < totalValue.length; i++) {
      var dyzValue = totalValue[i].MotivationValue;
      var fyft = (dyzValue / tolvalue) * moneyvalue;
      if (tolvalue === 0) {
        fyft = 0;
      }
      viewModel
        .getGridModel()
        .insertRow(i, {
          picihao: totalValue[i].batxhID,
          zhuzhileixing: totalValue[i].pigType,
          fentanbizhong: totalValue[i].proportion,
          cunlantoushuyuehuizong: totalValue[i].NumberOfHeads,
          dongyinzhi: dyzValue,
          feiyongfentan: fyft
        });
    }
  });