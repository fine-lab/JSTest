viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 供销社联合社--值改变后
    let orgid = data.value.orgid;
    cb.rest.invokeFunction("GT34544AT7.LocalOrgRegisterParam.onlyCheck", { orgid: orgid }, function (err, res) {
      if (err) {
        cb.utils.alert("唯一性校验出错", "error");
      } else if (res.res !== 0) {
        cb.utils.alert("该组织已经登记，请勿重复登记！", "error");
        viewModel.get("org_id").clear();
        viewModel.get("org_id_name").clear();
      }
    });
  });