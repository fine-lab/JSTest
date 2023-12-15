viewModel.on("customInit", function (data) {
  // 订单行药品特性互斥规则配置详情--页面初始化
  return;
  let purGrid = viewModel.getGridModel("drugControlPurList");
  let saleGrid = viewModel.getGridModel("DrugsControlSaleList");
  let ccsx_sale = viewModel.getGridModel("ccsxControlSaleList");
  let spsx_sale = viewModel.getGridModel("sy01_spsxControlSaleList");
  purGrid.on("beforeCellValueChange", function (data) {
    if (data.cellName == "type" && data.value != null) {
      if (data.value.value == purGrid.getCellValue(data.rowIndex, "type1")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
      if ((data.value.value == "9" && purGrid.getCellValue(data.rowIndex, "type1") == "10") || (data.value.value == "10" && purGrid.getCellValue(data.rowIndex, "type1") == "9")) {
        cb.utils.alert("其他商品不能和其他种类互斥", "error");
        return false;
      }
    }
    if (data.cellName == "type1" && data.value != null) {
      if (data.value.value == purGrid.getCellValue(data.rowIndex, "type")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
      if ((data.value.value == "9" && purGrid.getCellValue(data.rowIndex, "type") == "10") || (data.value.value == "10" && purGrid.getCellValue(data.rowIndex, "type") == "9")) {
        cb.utils.alert("其他商品不能和其他种类互斥", "error");
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
  ccsx_sale.on("beforeCellValueChange", function (data) {
    if (data.cellName == "ccsx" && data.value != null) {
      if (data.value.value == ccsx_sale.getCellValue(data.rowIndex, "hcsx")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
    }
    if (data.cellName == "hcsx" && data.value != null) {
      if (data.value.value == ccsx_sale.getCellValue(data.rowIndex, "ccsx")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
    }
  });
  spsx_sale.on("beforeCellValueChange", function (data) {
    if (data.cellName == "spsx" && data.value != null) {
      if (data.value.value == spsx_sale.getCellValue(data.rowIndex, "hcsx")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
    }
    if (data.cellName == "hcsx" && data.value != null) {
      if (data.value.value == spsx_sale.getCellValue(data.rowIndex, "spsx")) {
        cb.utils.alert("相同类型不可配置互斥", "error");
        return false;
      }
    }
  });
  //存储属性互斥-销售，设置默认
  //商品属性互斥-销售，设置默认
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