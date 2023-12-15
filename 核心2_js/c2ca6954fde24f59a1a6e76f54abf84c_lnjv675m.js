viewModel.on("customInit", function (data) {
  // 入社登记详情--页面初始化
  viewModel.on("afterLoadData", function (args) {
  });
  viewModel.get("Orgcode").on("onAfterValueChange", function (data) {});
});
viewModel.get("cert_no") &&
  viewModel.get("cert_no").on("afterValueChange", function (data) {
    // 身份证号--值改变后
    let cert_no = data.value;
    let joindate = cert_no.substring(6, 10) + "-" + cert_no.substring(10, 12) + "-" + cert_no.substring(12, 14);
    viewModel.get("birthdate").setValue(joindate);
    let sex_enum_number = "";
    sex_enum_number = cert_no.substring(16, 17);
    sex_enum_number = parseInt(sex_enum_number);
    sex_enum_number = sex_enum_number % 2;
    if (sex_enum_number == 0) {
      viewModel.get("sex_enum").setValue("2");
    } else if (sex_enum_number == 1) {
      viewModel.get("sex_enum").setValue("1");
    }
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    let item = viewModel.get("membertype_coop_name");
    cb.utils.triggerReferBrowse(item, [{ field: "id", op: "eq", value1: 2083458465714432 }]);
  });
viewModel.get("joindate") &&
  viewModel.get("joindate").on("afterValueChange", function (data) {
    // 入社时间--值改变后
    let item650uc = viewModel.get("item650uc").getValue();
    let joindate = viewModel.get("joindate").getValue();
    if (joindate < item650uc) {
      cb.utils.alert("入社时间不能早于合作社登记注册日期！", "error");
      viewModel.get("joindate").clear();
    }
  });