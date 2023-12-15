viewModel.on("customInit", function (data) {
  // 我的银行账户详情--页面初始化
  cb.rest.invokeFunction("GT34544AT7.authManager.getAll_orgJoin", {}, function (err, res) {
    if (res.res.length > 0) {
      var objstr = "";
      for (let i = 0; i < res.res.length; i++) {
        let obj = res.res[i];
        let objKeys = Object.keys(obj);
        for (let j = 0; j < objKeys.length; j++) {
          let objKeysstr = objKeys[j];
          if (i === res.res.length - 1 && j === objKeys.length - 1) {
            objstr = objstr + obj[objKeysstr];
          } else {
            objstr = objstr + obj[objKeysstr] + "_";
          }
        }
      }
    }
    viewModel.get("item382cg").setValue(objstr);
  });
});
viewModel.get("ManageDept_name").on("beforeBrowse", function () {
  var promise = new cb.promise();
  let ManageDept_name = viewModel.get("ManageDept_name");
  let org_id = viewModel.get("org_id").getValue();
  cb.rest.invokeFunction("GT34544AT7.authManager.getAllDeptJoin", { org_id: org_id }, function (err, res) {
    if (err) {
      console.log("err", err.message);
    }
    let deptArr = res.deptArr;
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "id",
      op: "in",
      value1: deptArr
    });
    ManageDept_name.setTreeFilter(condition);
    promise.resolve();
  });
  return promise;
});