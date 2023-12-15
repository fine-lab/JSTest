viewModel.get("button18kb") &&
  viewModel.get("button18kb").on("click", function (data) {
    // 重新推送--单击
    var url = "";
    var rowModel = viewModel.getGridModel().getData();
    console.error(rowModel);
    let data1 = rowModel[data.index];
    console.error(data1);
    let body = {
      billno: data1.billno,
      billtype: data1.billtype
    };
    console.error(body);
    let result = cb.rest.invokeFunction("AT164DBC9E08C00002.APIcontract.pushlogger", body, function (err, res) {}, viewModel, { async: false });
    if (result.error != undefined) {
      cb.utils.alert(result.error, "error");
    } else {
      cb.utils.alert(result.result.loadConditionKeyResponse);
    }
  });
viewModel.get("button47sd") &&
  viewModel.get("button47sd").on("click", function (data) {
    // 按钮--单击
    let billno = viewModel.get("item74gf").getValue();
    let billtype = viewModel.get("item56ri").getValue();
    let body = {
      billno: billno,
      billtype: billtype
    };
    let result = cb.rest.invokeFunction("AT164DBC9E08C00002.APIcontract.pushlogger", body, function (err, res) {}, viewModel, { async: false });
    if (result.error != undefined) {
      cb.utils.alert(result.error, "error");
    } else {
      cb.utils.alert(result.result.loadConditionKeyResponse);
    }
  });