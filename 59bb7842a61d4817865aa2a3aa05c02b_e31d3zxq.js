viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel("SY01_gspmanparams_curing_orgList");
  viewModel.on("afterLoadData", function () {
    let currentState = viewModel.getParams().mode;
    if (currentState != "edit") {
      return;
    }
    let isgspzz = viewModel.get("isgspzz").getValue();
    if (isgspzz == 1 || isgspzz == "1" || isgspzz == true || isgspzz == "true") {
      viewModel.get("poacontrol").setReadOnly(false);
    } else {
      viewModel.get("poacontrol").setReadOnly(true);
    }
  });
  viewModel.on("modeChange", function (data) {
    if (data == "edit") {
      let isgspzz = viewModel.get("isgspzz").getValue();
      if (isgspzz == 1 || isgspzz == "1" || isgspzz == true || isgspzz == "true") {
        viewModel.get("poacontrol").setReadOnly(false);
      } else {
        viewModel.get("poacontrol").setReadOnly(true);
      }
    }
  });
  viewModel.get("isgspzz").on("afterValueChange", function (data) {
    if (data.value == 1 || data.value == "1" || data.value == true || data.value == "true") {
      viewModel.get("poacontrol").setReadOnly(false);
    } else {
      viewModel.get("poacontrol").setReadOnly(true);
      viewModel.get("poacontrol").setValue(2);
    }
  });
  viewModel.get("poacontrol").on("beforeValueChange", function (data) {
    let isgspzz = viewModel.get("isgspzz").getValue();
    if (!(isgspzz == 1 || isgspzz == "1" || isgspzz == true || isgspzz == "true")) {
      cb.utils.alert("GSP证照已经关闭,不可以修改下级属性", "error");
      return false;
    }
  });
  viewModel.get("poacontrol").on("beforeValueChange", function (data) {
    let isgspzz = viewModel.get("isgspzz").getValue();
    if (!(isgspzz == 1 || isgspzz == "1" || isgspzz == true || isgspzz == "true")) {
      cb.utils.alert("GSP证照已经关闭,不可以修改下级属性", "error");
      return false;
    }
  });
  viewModel.on("beforeSave", function (data) {
    //判重
    let id = viewModel.get("id").getValue();
    let orgId = viewModel.get("org_id").getValue();
    let returnPromise = new cb.promise();
    validateUnique("GT22176AT10.GT22176AT10.SY01_gspmanparamsv3", id, orgId).then(
      (res) => {
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  let validateUnique = function (uri, id, orgId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.fieldsUnique", { id: id, tableUri: uri, fields: { org_id: { value: orgId } } }, function (err, res) {
        if (typeof res !== "undefined") {
          if (res.repeat == true) {
            reject("此组织已有相关配置");
          } else {
            resolve();
          }
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  viewModel.get("org_id_name").on("beforeBrowse", function (args) {
    debugger;
  });
});
viewModel.get("button16nj") &&
  viewModel.get("button16nj").on("click", function (data) {
    debugger;
    // 增行--单击
    gridModel.appendRow(null, true);
  });
viewModel.get("button13le") &&
  viewModel.get("button13le").on("click", function (data) {
    // 删行--单击
    debugger;
  });