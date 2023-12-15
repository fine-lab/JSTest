var mainGirdModel = viewModel.getGridModel();
viewModel.on("beforeSave", function (args) {
  var rows = mainGirdModel.getAllData();
  let num = 0;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].iswhere == 1) {
      num++;
    }
  }
  if (num == 0) {
    cb.utils.alert("至少有1个查询条件");
    return false;
  }
  //校验规则是否已分配
  const pk_config = viewModel.get("id").getValue();
  if (pk_config != null && pk_config != "") {
    const proxy = viewModel.setProxy({
      queryData: {
        url: "scmbc/bardistribute/checkConfig",
        method: "get"
      }
    });
    //传参
    const vmemo = "E"; //编辑
    const param = { pk_config, vmemo };
    const result = proxy.queryDataSync(param);
    if (!result.error.success) {
      cb.utils.alert(result.error.msg, "error");
      return false;
    }
  }
  //判断表体项是否重复
  var sarr = rows.sort();
  var repeatTerm = "";
  for (let i = 0; i < sarr.length; i++) {
    if (sarr[i].pk_item == sarr[i + 1].pk_item) {
      repeatTerm = sarr[i].pk_item_name;
      break;
    }
  }
  if (repeatTerm != "") {
    alert("表体中存在重复项：" + repeatTerm + ",不允许保存！");
    return false;
  }
});
mainGirdModel.on("afterCellValueChange", function (data) {
  var datas = mainGirdModel.getAllData();
  var cellName = data.cellName;
  if (cellName == "serial") {
    mainGirdModel.setCellState(data.rowIndex, "iswhere", "disabled", false);
    for (let i = 0; i < datas.length; i++) {
      if (data.value == datas[i].serial && data.rowIndex != i) {
        cb.utils.alert("序号不能重复", "error");
        mainGirdModel.setCellValue(data.rowIndex, "serial", 0);
        return;
      }
    }
  } else if (cellName == "pk_item_itemname") {
    if (data.value.itemcode == "cinvcode" || data.value.itemcode == "skuid") {
      mainGirdModel.setCellValue(data.rowIndex, "iswhere", 1);
      mainGirdModel.setCellState(data.rowIndex, "iswhere", "disabled", true);
    }
  } else {
    mainGirdModel.setCellState(data.rowIndex, "iswhere", "disabled", false);
  }
});
viewModel.on("beforeDelete", function (params) {
  //校验规则是否已分配
  const pk_config = viewModel.get("id").getValue();
  if (pk_config != null && pk_config != "") {
    const proxy = viewModel.setProxy({
      queryData: {
        url: "scmbc/bardistribute/checkConfig",
        method: "get"
      }
    });
    //传参
    const vmemo = "D"; //删除
    const param = { pk_config, vmemo };
    const result = proxy.queryDataSync(param);
    if (!result.error.success) {
      cb.utils.alert(result.error.msg, "error");
      return false;
    }
  }
});