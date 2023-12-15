viewModel.get("test_GxyRole_name") &&
  viewModel.get("test_GxyRole_name").on("beforeBrowse", function (data) {
    // 授权角色--参照弹窗打开前
    let promise = new cb.promise();
    let test_GxyService = viewModel.get("test_GxyService").getValue();
    cb.rest.invokeFunction("GT3AT33.role.canUseRole", { test_GxyService: test_GxyService }, function (err, res) {
      if (err != null) {
        cb.utils.alert("查询免费服务时报错" + JSON.stringify(err), "error");
      }
      let roleArr = res.roleArr;
      if (roleArr.length == 0) {
        var myFilter = { isExtend: true, simpleVOs: [] };
        myFilter.simpleVOs.push({
          //如果没有查询到内容，说明用户没有选择服务。这时候，一个角色也不展示。
          field: "id",
          op: "in",
          value1: "roleArr002500351654165151dsgjkiojdsgpsadoigjrpdakgjsdpiok"
        });
        viewModel.get("test_GxyRole_name").setFilter(myFilter);
        cb.utils.alert("请先选择服务", "success");
        promise.resolve();
      }
      var myFilter = { isExtend: true, simpleVOs: [] };
      myFilter.simpleVOs.push({
        field: "id",
        op: "in",
        value1: roleArr
      });
      viewModel.get("test_GxyRole_name").setFilter(myFilter);
      promise.resolve();
    });
    return promise;
  });
viewModel.get("test_OrderServiceUseOrg_test_GxyService_name") &&
  viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").on("beforeBrowse", function (data) {
    // 服务项目--参照弹窗打开前
    let org_id = viewModel.get("org_id").getValue(); //管理组织ID
    let isGXY = viewModel.get("item1326fg").getValue();
    if (!isGXY) {
      var myFilter = { isExtend: true, simpleVOs: [] };
      myFilter.simpleVOs.push({
        field: "UseOrg",
        op: "eq",
        value1: org_id
      });
      myFilter.simpleVOs.push({
        field: "charge",
        op: "eq",
        value1: "1"
      });
      myFilter.simpleVOs.push({
        //验证后删除该数据
        field: "id",
        op: "neq",
        value1: "1793575087367520455"
      });
      viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").setFilter(myFilter);
    }
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 管理组织--值改变后
    cb.rest.invokeFunction("GT3AT33.utils.areaAdminOrg", {}, function (err, res) {
      console.log("res", JSON.stringify(res));
      viewModel.get("item1241kd").setValue(JSON.stringify(res.arr));
    });
    cb.rest.invokeFunction("GT3AT33.utils.adminOrg", {}, function (err, res) {
      viewModel.get("item1318td").setValue(JSON.stringify(res.arr));
    });
    cb.rest.invokeFunction("GT3AT33.utils.isGXY", {}, function (err, res) {
      if (!cb.utils.isEmpty(err)) {
        viewModel.get("item1326fg").setValue(false);
      } else {
        viewModel.get("item1326fg").setValue(res.res);
      }
    });
  });