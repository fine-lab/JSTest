viewModel.on("customInit", function (data) {
  //产权登记业务设置详情--页面初始化
  viewModel.on("afterRule", function (args) {
    let orgid = viewModel.get("org_id").getValue();
    let result = cb.rest.invokeFunction("GT34544AT7.LocalOrgRegisterParam.OrgParamCheck", { orgid: orgid }, function (err, res) {}, viewModel, { async: false });
    let count = result.result.res;
    if (count > 0) {
      viewModel.get("enable").setValue(0);
    } else {
      viewModel.get("enable").setValue(1);
    }
  });
});
viewModel.get("LORParamOrglistList") &&
  viewModel.get("LORParamOrglistList").on("afterCellValueChange", function (data) {
    //表格-企业产权管理组织明细表--单元格值改变后
    let cellName = data.cellName;
    let InvestInOrg = data.value.id;
    if (cellName == "InvestInOrg") {
      let rowsData = viewModel.getGridModel().getRows();
      for (let i = 0; i < rowsData.length - 1; i++) {
        let rowData = rowsData[i];
        let rowInvestInOrg = rowData.InvestInOrg;
        if (InvestInOrg == rowInvestInOrg) {
          viewModel.get("item412uf").setValue("1");
          cb.utils.alert("接受监督的企业有重复，\n稍后将无法进行保存，\n请检查。", "waring");
        }
      }
    }
  });