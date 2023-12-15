viewModel.get("item1364bc_name") &&
  viewModel.get("item1364bc_name").on("afterValueChange", function (data) {
    // 希望支持部门--值改变后
  });
viewModel.get("item1364bc_name") &&
  viewModel.get("item1364bc_name").on("afterReferOkClick", function (data) {
    // 希望支持部门--参照弹窗确认按钮点击后
    const perData = viewModel.getParams().perData;
    let deptId = perData ? perData.data.adminOrgVO : viewModel.get("AdminOrgVO").getValue();
    debugger;
    //带入部门负责人信息，
    cb.rest.invokeFunction(
      "GT65292AT10.backDefaultGroup.getPrincipalByDeptId",
      {
        deptId: deptId
      },
      function (err, res) {
        console.log(err);
        console.log(res);
        var jsondate = JSON.parse(JSON.stringify(res));
        var data = jsondate.apiResponse;
        var data1 = JSON.parse(data).data;
        var principal = data1.principal;
        var principal_name = data1.principal_name;
        //用于卡片页面，页面初始化赋值等操作
        setTimeout(function () {
          viewModel.get("deptprincipal").setValue(principal);
          viewModel.get("deptprincipal_name").setValue(principal_name);
        }, 5);
        var presalesModel = viewModel.get("PresaleAppon_presalesConsultantList");
        presalesModel.clear();
        var gridmodel = viewModel.get("PresaleA_1List");
        gridmodel.clear();
      }
    );
  });