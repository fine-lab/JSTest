viewModel.get("button21yb") &&
  viewModel.get("button21yb").on("click", function (data) {
    //推送SAP凭证--单击
    var selecteds = viewModel.getGridModel().getSelectedRows();
    if (selecteds.length == 0) {
      cb.utils.alert("请选择要推送SAP凭证的记录", "error");
      return;
    }
    var ids = [];
    viewModel
      .getGridModel()
      .getSelectedRows()
      .forEach((head) => {
        ids.push(head.id);
      });
    var param = { ids: ids };
    var promiseoa = new cb.promise();
    cb.rest.invokeFunction("AT19D33B7809D80002.custgrouppzjcapi.custsendsap", param, function (err, res) {
      if (err) {
        cb.utils.alert("失败" + err.message, "error");
        promiseoa.reject();
      }
      if (res) {
        cb.utils.alert(JSON.stringify(res), "success");
        viewModel.execute("refresh");
        promiseoa.resolve();
      }
    });
    return promiseoa;
  });
viewModel.get("button16dc") &&
  viewModel.get("button16dc").on("click", function (data) {
    //取消SAP凭证--单击
    var selecteds = viewModel.getGridModel().getSelectedRows();
    if (selecteds.length == 0) {
      cb.utils.alert("请选择要取消SAP凭证的记录", "error");
      return;
    }
    var ids = [];
    viewModel
      .getGridModel()
      .getSelectedRows()
      .forEach((head) => {
        ids.push(head.id);
      });
    var param = { ids: ids };
    var promiseoa = new cb.promise();
    cb.rest.invokeFunction("AT19D33B7809D80002.custgrouppzjcapi.custrollbacksap", param, function (err, res) {
      if (err) {
        cb.utils.alert("失败" + err.message, "error");
        promiseoa.reject();
      }
      if (res) {
        cb.utils.alert(JSON.stringify(res), "success");
        viewModel.execute("refresh");
        promiseoa.resolve();
      }
    });
    return promiseoa;
  });