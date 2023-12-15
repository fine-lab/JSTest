viewModel.get("button47cb") &&
  viewModel.get("button47cb").on("click", function (data) {
    // 退货--单击
    debugger;
    var model = viewModel.getGridModel();
    var data = model.getSelectedRows();
    var reponse = "";
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        reponse = cb.rest.invokeFunction("SCMSA.backDesignerFunction.SapRfc", { data: data[i] }, function (err, res) {}, viewModel, { async: false });
        if (reponse.result.mesage.TRAN_FLAG == 0) {
          //调用SAP接口成功
          var ddh = reponse.result.mesage.EXNUM;
          var cgxx = reponse.result.mesage.MESSAGE;
          cb.utils.alert("该订单编号：" + ddh + "\n" + "-- 调取SAP接口成功：：" + cgxx + " --");
        } else {
          //调用SAP接口失败
          var ddh1 = reponse.result.mesage.EXNUM;
          var cgxx1 = reponse.result.mesage.MESSAGE;
          cb.utils.alert("该订单编号：" + ddh1 + "\n" + "-- 调取SAP接口失败：" + cgxx1 + " --");
        }
      }
    } else {
      cb.utils.alert("-- 请选择行！！！ --");
    }
  });