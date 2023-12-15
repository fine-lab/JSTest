viewModel.get("button32rd") &&
  viewModel.get("button32rd").on("click", function (data) {
    //临时按钮勿点--单击
    debugger;
    var girdModel = viewModel.getGridModel();
    // 获取数据下标
    const indexArr = girdModel.getSelectedRowIndexes();
    let MessageData = {};
    let ArrayList = new Array();
    let returnData = {};
    let returnList = new Array();
    if (indexArr.length > 0) {
      for (var j = 0; j < indexArr.length; j++) {
        // 获取行号
        var row = indexArr[j];
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        // 该条单据的id
        var ID = SunData[0].id;
        var code = SunData[0].code;
        var res = cb.rest.invokeFunction("ST.backDesignerFunction.SCTestOrder", { ID: ID }, function (err, res) {}, viewModel, { async: false });
        if (res.error != null) {
          let message = res.error.message;
          MessageData = {
            调整单号为: code,
            错误信息: message
          };
          ArrayList.push(MessageData);
        } else {
          returnData = {
            调整单号为: code,
            成功返回: "下推OMS成功！"
          };
          returnList.push(returnData);
        }
      }
      if (ArrayList.length > 0) {
        alert(JSON.stringify(ArrayList));
      }
      if (returnList.length > 0) {
        alert(JSON.stringify(returnList));
      }
    }
  });