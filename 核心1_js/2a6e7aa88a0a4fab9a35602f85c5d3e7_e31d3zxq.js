viewModel.on("customInit", function (data) {
  //对方业务员模态框
  viewModel.on("afterLoadData", function () {
    if (viewModel.getParams().mode == "add") {
      let gspOrgId = viewModel.getParams().gspOrgId;
      if (gspOrgId != undefined) {
        //组织
        viewModel.get("item4nd").setValue(viewModel.getParams().gspOrgName);
        //客户
        viewModel.get("item25re").setValue(viewModel.getParams().gspCustomerName);
        //供应商
        viewModel.get("item34xb").setValue(viewModel.getParams().gspSupplierName);
      }
    }
  });
  viewModel.get("button30rd").on("click", function () {
    let orgId = viewModel.getParams().gspOrgId;
    let name = viewModel.get("item10xh").getValue();
    if (name == undefined || name == "" || name == null) {
      cb.utils.alert("名称不允许为空", "error");
    } else {
      let returnPromise = new cb.promise();
      let type;
      let objId;
      if (viewModel.getParams().gspCustomer != undefined) {
        type = "customer";
        objId = viewModel.getParams().gspCustomer;
      }
      if (viewModel.getParams().gspSupplier != undefined) {
        type = "supplier";
        objId = viewModel.getParams().gspSupplier;
      }
      if (type == undefined) {
        cb.utils.alert("传参错误", "error");
        return false;
      }
      cb.rest.invokeFunction("GT22176AT10.publicFunction.addSalesMan", { orgId: orgId, type: type, objId: objId, name: name }, function (err, res) {
        if (typeof res != "undefined") {
          if (res.code != "200" && res.code != 200) {
            cb.utils.alert(res.errMsg, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
            viewModel.communication({ type: "modal", payload: { data: false } });
            cb.utils.alert("保存成功，点击搜索即可看到最新");
          }
        } else if (typeof err != "undefined") {
          cb.utils.alert(err.message, "error");
          returnPromise.reject();
        }
        return returnPromise;
      });
    }
  });
});