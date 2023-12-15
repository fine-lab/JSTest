viewModel.on("afterLoadData", function (args) {
  cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.queryCurrentUnit", {}, function (err, res) {
    if (res) {
      debugger;
      //采购组织 pk_org_v_name
      if (res.org && res.org[0]) {
        viewModel.get("pk_org_v").setValue(res.org[0].id);
        viewModel.get("pk_org_v_name").setValue(res.org[0].name);
        viewModel.get("signorg").setValue(res.org[0].id);
        viewModel.get("signorg_name").setValue(res.org[0].name);
        viewModel.get("customerAddress").setValue(res.org[0].address);
        viewModel.get("customerTel").setValue(res.org[0].telephone);
      }
      //采购部门 depid_name
      if (res.dept && res.dept[0]) {
        viewModel.get("depid").setValue(res.dept[0].id);
        viewModel.get("depid_name").setValue(res.dept[0].name);
      }
      // 采购人员
      if (res.user) {
        viewModel.get("personnelid").setValue(res.user.id);
        viewModel.get("personnelid_name").setValue(res.user.name);
      }
    }
  });
  var referModel = viewModel.get("cprojectid_name");
  referModel.on("beforeBrowse", function (args) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    //获取过滤条件
    condition.simpleVOs.push({
      field: "freeDefine.define1",
      op: "eq",
      value1: "true"
    });
    this.setFilter(condition);
  });
  viewModel.get("button60jd").setVisible(false);
});
viewModel.on("customInit", function (data) {
  // 广告及宣传服务采购合同详情--页面初始化
});