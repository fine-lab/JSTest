viewModel.on("customInit", function (data) {
  // 供应商银行账户维护详情--页面初始化
  let mode = viewModel.getParams().mode;
  // 卡片新增状态使用
  if (mode.toLocaleLowerCase() == "add") {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    viewModel.get("org_id_name").on("afterValueChange", () => {
      viewModel.get("input_date").setValue(formatDate(new Date()));
    });
  }
});
viewModel.on("modeChange", (mode) => {
  if (mode.toLocaleLowerCase() == "browse") {
    viewModel.get("dropdownbutton18ij").setDisabled(false);
  } else {
    viewModel.get("dropdownbutton18ij").setDisabled(true);
  }
});
//设置保存前校验
viewModel.on("beforeSave", function (args) {
  var inputdate = viewModel.get("input_date").getValue();
  var opendate = viewModel.get("open_date").getValue();
  //判断 dateA 是否大于 dateB，为 true，登记日期应该大于开立日期
  const isAfterDate = (inputdate, opendate) => inputdate > opendate;
  if (!isAfterDate(inputdate, opendate)) {
    cb.utils.alert("登记日期必须大于账户开立日期");
    return false;
  }
});
viewModel.get("SUPPLIER_NAME") &&
  viewModel.get("SUPPLIER_NAME").on("afterReferOkClick", function (data) {
    // 所属供应商--参照弹窗确认按钮点击后
    viewModel.get("TAX_NO").setValue("");
    debugger;
    var supplier = viewModel.get("SUPPLIER").getValue();
    var supplier_name = viewModel.get("SUPPLIER_NAME").getValue();
    if (supplier != null && supplier != "") {
      cb.rest.invokeFunction("a6d171df9fb146b9a5800ccf90c103db", { supplier: supplier }, function (err, res) {
        var id = res.id;
        if (id == "") {
          cb.utils.alert("供应商银行账户非启用状态，请检查!");
          viewModel.get("SUPPLIER_NAME").setValue("");
          viewModel.get("SUPPLIER").setValue("");
        }
      });
    }
  });
viewModel.get("button20wj") &&
  viewModel.get("button20wj").on("click", function (data) {
    // 冻结--单击
    var data = viewModel.getAllData();
    //账户状态
    var accStatus = viewModel.get("ACCOUNT_STATUS").getValue();
    //校验
    if (accStatus != "NORMAL") {
      cb.utils.alert("只有状态为正常的单据才可以冻结！");
    } else {
      cb.rest.invokeFunction("8cd4c8ef487f420785795196aa22da2d", { data: data }, function (err, res) {
        var data = res.data;
        if (data != null) viewModel.setData(data);
      });
    }
  });