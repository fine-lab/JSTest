viewModel.on("customInit", function (data) {
  // 供应商银行账户详情--页面初始化
  let model = viewModel.getParams().mode;
  if (model.toLocaleLowerCase() === "add") {
    viewModel.get("org_id_name").on("afterValueChange", () => {
      viewModel.get("inputdate").setValue("2023-03-24");
    });
  }
});
viewModel.on("beforeSave", () => {
  const getComponent = (str) => {
    return viewModel.get(str).getValue();
  };
  if (getComponent("inputdate") < getComponent("opendate")) {
    cb.utils.alert("警告！！");
    return false;
  }
});
viewModel.get("supplier_name") &&
  viewModel.get("supplier_name").on("afterValueChange", function (data) {
    // 所属供应商 --值改变后
    viewModel.get("taxno").setValue("");
    var supplier = viewModel.get("supplier").getValue();
    var supplier_name = viewModel.get("supplier_name").getValue();
    if (supplier != null && supplier != "") {
      cb.rest.invokeFunction("6413dd7dfa2b46ab8feefb8aad2f061eAT176A72B808400003.wzp.api123123", { supplier: supplier }, function (err, res) {
        var id = res.id;
        if (id === "") {
          cb.utils.alert("供应商银行账户非启用状态，请检查!");
          viewModel.get("supplier_name").setValue("");
          viewModel.get("supplier").setValue("");
        }
      });
    }
  });
viewModel.get("button21bb") &&
  viewModel.get("button21bb").on("click", function (data) {
    // 冻结--单击
    var viewModel = this;
    var data = viewModel.getAllData();
    //账户状态
    var custaccstatus = viewModel.get("custaccstatus").getValue();
    //校验
    if (custaccstatus != "1") {
      cb.utils.alert("只有状态为正常的单据才可以冻结！");
    } else {
      cb.rest.invokeFunction("AT176A72B808400003.wzp.Frezzbill", { data: data }, function (err, res) {
        var data = res.data;
        if (data != null) viewModel.setData(data);
      });
    }
  });