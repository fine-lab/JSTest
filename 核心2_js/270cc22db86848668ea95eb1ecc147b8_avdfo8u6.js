viewModel.get("button132za") &&
  viewModel.get("button132za").on("click", function (data) {
    // 同步返回--单击
    var idnum = viewModel.get("id").getValue();
    var posed = cb.rest.invokeFunction("SCMSA.jyApi.returnOrderToYS", { id: idnum, flag: "false" }, function (err, res) {}, viewModel, { async: false });
    if (posed.error) {
      cb.utils.confirm("返回失败：" + posed.error.message);
      return false;
    }
    var updateRes = JSON.parse(posed.result.resSql);
    if (updateRes.code != 200) {
      cb.utils.confirm("返回失败：" + updateRes.message);
      return false;
    }
    cb.utils.alert("返回成功!");
    viewModel.execute("refresh");
  });
viewModel.get("button65nd") &&
  viewModel.get("button65nd").on("click", function (data) {
    // 同步巨益--单击
    var idnum = viewModel.get("id").getValue();
    var remarkValue = viewModel.get("saleReturnMemo!remark").getValue();
    var sendRes = cb.rest.invokeFunction("SCMSA.jyApi.returnOrderToJY", { idnum: idnum, remark: remarkValue }, function (err, res) {}, viewModel, { async: false });
    if (sendRes.error) {
      cb.utils.confirm("同步巨益异常：" + sendRes.error.message);
      return false;
    }
    cb.utils.confirm("同步成功！");
    viewModel.execute("refresh");
  });
viewModel.on("customInit", function (data) {
  // 销售退货单--页面初始
  viewModel.on("afterLoadData", function () {
    const value = viewModel.get("headFreeItem!define1").getValue();
    const statusValue = viewModel.get("saleReturnStatus").getValue(); //单据状态
    if (value == "true") {
      viewModel.get("btnEdit").setVisible(false); //编辑按钮
      viewModel.get("button65nd").setVisible(false); //同步巨益
      if ("ENDSALERETURN" != statusValue) {
        viewModel.get("button132za").setVisible(true); //同步返回
      } else {
        viewModel.get("button132za").setVisible(false); //同步返回
      }
    } else {
      viewModel.get("btnEdit").setVisible(true); //编辑按钮
      if ("SUBMITSALERETURN" == statusValue) {
        //发货待审
        viewModel.get("button65nd").setVisible(false); //同步巨益
      } else {
        viewModel.get("button65nd").setVisible(true); //同步巨益
      }
      viewModel.get("button132za").setVisible(false); //同步返回
    }
  });
  viewModel.on("modeChange", function (data) {
    if (data == "add" || data == "edit") {
      viewModel.get("btnEdit").setVisible(false); //编辑按钮
      viewModel.get("button65nd").setVisible(false); //同步巨益
      viewModel.get("button132za").setVisible(false); //同步返回
    }
  });
});