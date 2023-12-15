viewModel.get("button19mf") &&
  viewModel.get("button19mf").on("click", function (data) {
    //按钮--单击
    debugger;
    let selectData = viewModel.getGridModel().getSelectedRows();
    if (selectData.length == 0) {
      cb.utils.alert("请选择一条数据", "warn");
      return;
    }
    let ids = [];
    let poNumbers = [];
    let idMap = new Map();
    for (let i = 0; i < selectData.length; i++) {
      // 状态为新建
      // 组装对象结构为，根据ID更新字段，推送成功可直接使用这个对象更新状态
      if (!idMap.has(selectData[i].id)) {
        ids.push(selectData[i].id);
        poNumbers.push(selectData[i].orderHeaderNum);
        idMap.set(selectData[i].id, 1);
      }
    }
    cb.rest.invokeFunction("GT37595AT2.orderChangeFun.manualPushHt", { ids: ids, poNumbers: poNumbers }, function (err, res) {
      if (err) {
        cb.utils.alert("推送失败！失败原因：" + err.message, "error");
      } else if (res.status == "0") {
        cb.utils.alert("推送成功！", "success");
        viewModel.execute("refresh");
      } else {
        cb.utils.alert("推送失败！", "error");
      }
    });
  });