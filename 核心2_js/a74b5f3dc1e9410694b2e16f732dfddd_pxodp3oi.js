viewModel.get("button60ib") &&
  viewModel.get("button60ib").on("click", function (data) {
    // 生成暂估凭证--单击
    let limitRowNum = 5;
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows == null || rows.length == 0) {
      cb.utils.alert("温馨提示！请选择要生成暂估凭证的单据!", "info");
      return;
    }
    debugger;
    let idArray = [];
    for (var i in rows) {
      let row = rows[i];
      if (row.verifystate == 2) {
        idArray.push(row.id + "**" + row.code);
      }
    }
    if (idArray.length == 0) {
      cb.utils.alert("温馨提示！请选择已审核且尚未生成暂估凭证的单据!", "info");
      return;
    }
    if (idArray.length > limitRowNum) {
      cb.utils.alert("温馨提示！生成暂估凭证较慢,一次不能超过" + limitRowNum + "条,请重新选择!", "info");
      return;
    }
    cb.utils.confirm(
      "您确定要为所选订单生成暂估凭证？该操作耗时较长，请耐心等待!",
      () => {
        ReactDOM.render(React.createElement(Loading), document.createElement("div"));
        cb.rest.invokeFunction("GT3734AT5.APIFunc.createVoucherApi", { redVoucher: 1, newFlag: 1, ids: idArray.join() }, function (err, res) {
          stop();
          if (err != null) {
            cb.utils.alert("温馨提示！生成凭证失败，请刷新后重试!" + err.message, "error");
            return;
          }
          var rst = res.rst;
          if (rst) {
            cb.utils.alert(res.msg, "info", 10, false, function () {});
          } else {
            cb.utils.alert("温馨提示！凭证生成失败，请刷新后重试![" + res.msg + "]", "error");
          }
          viewModel.execute("refresh");
        });
      },
      () => {
        return;
      }
    );
  });
function Loading() {
  var hook = React.useState(true);
  stop = hook[1];
  return React.createElement(TinperNext.Spin, { spinning: hook[0] });
}