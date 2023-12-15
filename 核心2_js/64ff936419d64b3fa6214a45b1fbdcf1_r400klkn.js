viewModel.on("customInit", function (data) {
  // 订单行药品特性互斥规则配置详情--页面初始化
  let purGrid = viewModel.getGridModel("drugControlPurList");
  let saleGrid = viewModel.getGridModel("DrugsControlSaleList");
  purGrid.on("beforeCellValueChange", function (data) {
    if (data.cellName == "type" && data.value != null) {
      if (data.value.value == purGrid.getCellValue(data.rowIndex, "type1")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
    }
    if (data.cellName == "type1" && data.value != null) {
      if (data.value.value == purGrid.getCellValue(data.rowIndex, "type")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
    }
  });
  saleGrid.on("beforeCellValueChange", function (data) {
    if (data.cellName == "type" && data.value != null) {
      if (data.value.value == saleGrid.getCellValue(data.rowIndex, "type1")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
    }
    if (data.cellName == "type1" && data.value != null) {
      if (data.value.value == saleGrid.getCellValue(data.rowIndex, "type")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
    }
  });
  viewModel.on("beforeSave", function (data) {
    //判重
    let id = viewModel.get("id").getValue();
    let orgId = viewModel.get("org_id").getValue();
    let returnPromise = new cb.promise();
    validateUnique("GT22176AT10.GT22176AT10.sy01_orderDrugsControl", id, orgId).then(
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
});