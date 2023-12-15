viewModel.on("customInit", function (data) {
  // 药品停售列表--页面初始化
  var gridModel = viewModel.getGridModel();
  viewModel.on("beforeBatchpush", function (args) {
    debugger;
    // 获取选中行的退回ID
    var gridModelx = viewModel.getGridModel();
    var rows = gridModelx.getSelectedRows();
    if (rows.length < 1) {
      return cb.utils.alert("请选择数据", "alert");
    }
    if (args.args.cSvcUrl.indexOf("targetBillNo=st_stockstatuschange") > 0) {
      var returnPromise = new cb.promise();
      for (var i = 0; i < rows.length; i++) {
        var id = rows[i].id;
        var uri = "GT22176AT10.GT22176AT10.SY01_drugsuspension";
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.checkstoporder", { id: id, uri: uri }, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.Info && res.Info.length > 0) {
            cb.utils.alert(res.Info, "error");
            return false;
          }
          returnPromise.resolve();
        });
      }
      return returnPromise;
    }
    // 解除停售对应下推判断逻辑
    if (args.args.cSvcUrl.indexOf("targetBillNo=d15737c7") > 0) {
      var returnPromise = new cb.promise();
      for (var i = 0; i < rows.length; i++) {
        // 获取退回检验单的ID
        var id = rows[i].id;
        var code = rows[i].id;
        // 调用校验API函数
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.stopSailPushResume", { id: id, code: code }, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.errInfo && res.errInfo.length > 0) {
            cb.utils.alert(res.errInfo, "error");
            return false;
          }
          returnPromise.resolve();
        });
      }
      return returnPromise;
    }
  });
});