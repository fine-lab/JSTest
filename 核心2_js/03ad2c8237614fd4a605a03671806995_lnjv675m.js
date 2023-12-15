viewModel.on("customInit", function (data) {
  var currentState = viewModel.getParams();
  if (currentState.mode == "edit") {
    setTimeout(function () {});
  }
  setTimeout(function () {
    var type = viewModel.get("gxyCusType").getValue();
    console.log("type = ");
    console.log(type);
    switch (type) {
      case "A1":
        viewModel.get("sysparentcode").setValue("GxyCus");
        viewModel.get("item161zc").setValue("GxyCus");
        break;
      default:
        viewModel.get("sysparentcode").setValue("GxySH");
        viewModel.get("item161zc").setValue("GxySH");
    }
  }, 200);
  // 供销云客户详情--页面初始化
});
viewModel.get("gxyCusType") &&
  viewModel.get("gxyCusType").on("afterValueChange", function (data) {
    // 供销云客户分类--值改变后
    console.log("datachange");
    console.log(data);
    var type = data.value.text;
    switch (type) {
      case "区域运营商":
        viewModel.get("sysparentcode").setValue("GxyCus");
        viewModel.get("item161zc").setValue("GxyCus");
        break;
      default:
        viewModel.get("sysparentcode").setValue("GxySH");
        viewModel.get("item161zc").setValue("GxySH");
    }
    viewModel.get("orgNo").setValue("");
  });
viewModel.get("orgNo") &&
  viewModel.get("orgNo").on("afterValueChange", function (data) {
    let returnPromise = new cb.promise();
    // 顺序码--值改变后
    console.log("顺序码--值改变后");
    let code = viewModel.get("item161zc").getValue() + viewModel.get("orgNo").getValue();
    if (viewModel.get("orgNo") !== "") {
      let sql = "select id,OrgCode from GT1559AT25.GT1559AT25.GxyCustomer where OrgCode='" + code + "'";
      cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
        console.log(res);
        let recordList = res.recordList;
        if (recordList.length > 0) {
          cb.utils.confirm(
            "组织编码存在，请重新输入序号:",
            function () {},
            function () {}
          );
          viewModel.get("orgNo").setValue("");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      });
    }
    return returnPromise;
  });