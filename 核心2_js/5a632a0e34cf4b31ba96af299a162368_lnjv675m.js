viewModel.get("test_GxyService_name") &&
  viewModel.get("test_GxyService_name").on("afterValueChange", function (data) {
    // 服务项目--值改变后
    let test_GxyServiceField = data.value.test_GxyServiceField; //服务领域ID
    let test_GxyServiceField_name = data.value.test_GxyServiceField_name; //服务领域
    let org_id = viewModel.get("org_id").getValue(); //订购组织ID
    cb.rest.invokeFunction("GT3AT33.AddServiceApply.verifiField", { test_GxyServiceField: test_GxyServiceField, org_id: org_id }, function (err, res) {
      let arr = res.res;
      if (arr.length > 0) {
        cb.utils.alert("服务订购单中已存在" + test_GxyServiceField_name + "领域的服务订购单，请勿重复添加！", "error");
        viewModel.get("test_GxyService_name").clear();
        viewModel.get("btnSave").setVisible(false);
      } else {
        viewModel.get("btnSave").setVisible(true);
      }
    });
  });
viewModel.get("UserUnitPrice") &&
  viewModel.get("UserUnitPrice").on("afterValueChange", function (data) {
    // 用户价格--值改变后
    let num = data.value;
    if (num == 0) {
      viewModel.get("Userquantity").setValue(999999);
      viewModel.get("Userquantity").setReadOnly(true);
    }
  });
viewModel.get("OrgUnitPrice") &&
  viewModel.get("OrgUnitPrice").on("afterValueChange", function (data) {
    // 组织账簿价格--值改变后
    let num = data.value;
    if (num == 0) {
      viewModel.get("Orgquantity").setValue(999999);
      viewModel.get("Orgquantity").setReadOnly(true);
    }
  });
viewModel.get("test_GxyService_name") &&
  viewModel.get("test_GxyService_name").on("beforeBrowse", function (data) {
    // 服务项目--参照弹窗打开前
  });