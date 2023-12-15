viewModel.get("button53ik") &&
  viewModel.get("button53ik").on("click", function (data) {
    // 按钮--单击
    debugger;
    var girdModel = viewModel.getGridModel();
    // 获取数据下标
    const indexArr = girdModel.getSelectedRowIndexes();
    let MessageData = {};
    let ArrayList = new Array();
    if (indexArr.length > 0) {
      for (var j = 0; j < indexArr.length; j++) {
        // 获取行号
        var row = indexArr[j];
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        // 该条单据的id
        var ID = SunData[0].id;
        var tid = SunData[0].tid;
        var saleoutcode = SunData[0].saleoutcode;
        if (saleoutcode != undefined || saleoutcode != null) {
          var res = cb.rest.invokeFunction("SDOC.API.XSCKApi", { tid: tid, saleoutcode: saleoutcode }, function (err, res) {}, viewModel, { async: false });
          if (res.error != null) {
            let message = res.error.message;
            MessageData = {
              校验原单编码: tid,
              错误信息: message
            };
            ArrayList.push(MessageData);
          } else {
            alert("交易编号为：" + tid + "  下推OMS出库成功！");
          }
        } else {
          MessageData = {
            校验原单编码: tid,
            错误信息: "YS销售出库未生成"
          };
          ArrayList.push(MessageData);
        }
      }
      if (ArrayList.length > 0) {
        alert(JSON.stringify(ArrayList));
      }
    }
  });