viewModel.on("customInit", function (data) {
  //上市许可持有人模态框
  viewModel.on("afterLoadData", function () {
    if (viewModel.getParams().mode == "add") {
      let gspOrgId = viewModel.getParams().gspOrgId;
      if (gspOrgId != undefined) {
        //组织
        viewModel.get("orgId").setValue(viewModel.getParams().gspOrgId);
        //组织名称
        viewModel.get("orgName").setValue(viewModel.getParams().gspOrgName);
      }
    }
  });
  viewModel.get("button8mc").on("click", function () {
    let orgId = viewModel.getParams().gspOrgId;
    let name = viewModel.get("name").getValue();
    let orgName = viewModel.get("orgName").getValue();
    let legalperson = viewModel.get("legalperson").getValue();
    let quaperson = viewModel.get("quaperson").getValue();
    let description = viewModel.get("description").getValue();
    if (name == undefined || name == "" || name == null) {
      cb.utils.alert("名称不允许为空", "error");
      return;
    } else if (orgName == undefined || orgName == "" || orgName == null) {
      cb.utils.alert("组织不允许为空", "error");
      return;
    } else {
      let returnPromise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.addLisenseHolder",
        { orgId: orgId, name: name, legalperson: legalperson, quaperson: quaperson, description: description },
        function (err, res) {
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
        }
      );
    }
  });
});