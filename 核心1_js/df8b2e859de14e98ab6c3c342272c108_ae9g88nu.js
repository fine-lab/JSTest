viewModel.on("customInit", function (data) {
  // 公司经营范围详情--页面初始化
  let sy_zz = "sy01_business_licenseList";
  let sy_zz_fw = "sy01_business_license_scopeList";
  let sy_zz_grid = viewModel.getGridModel(sy_zz);
  let sy_zz_fw_grid = viewModel.getGridModel(sy_zz_fw);
  //设置列表页面固定高度 设置表格fixedHeight属性  取值为number类型 单位：px
  sy_zz_grid.setState("fixedHeight", 210);
  sy_zz_fw_grid.setState("fixedHeight", 210);
  let authTypeFieldName = "authType";
  sy_zz_grid.on("afterCellValueChange", function (data) {
    if (data.cellName == authTypeFieldName && data.value != data.oldValue) {
      sy_zz_fw_grid.deleteAllRows();
      switchDisplayFields(sy_zz_fw_grid, data.value);
    }
  });
  //初始化时参照查询值
  sy_zz_fw_grid.on("beforeSetDataSource", function (data) {
    let authTypeValue = sy_zz_grid.getCellValue(sy_zz_grid.getFocusedRowIndex(), authTypeFieldName);
    switchDisplayFields(sy_zz_fw_grid, authTypeValue);
  });
  sy_zz_fw_grid.on("beforeCellValueChange", function (data) {
    let rows = sy_zz_fw_grid.getRows();
    let authTypeValue = sy_zz_grid.getCellValue(sy_zz_grid.getFocusedRowIndex(), authTypeFieldName);
    if (authTypeValue == undefined) {
      cb.utils.alert("请先选择授权范围");
      return false;
    }
    let flag = true;
    if (data.cellName == "material_name" && authTypeValue == 1 && data.value != null && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "material", data.value.id);
    } else if (data.cellName == "materialType_catagoryname" && authTypeValue == 2 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "materialType", data.value.id);
    } else if (data.cellName == "dosage_dosagaFormName" && authTypeValue == 3 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "dosage", data.value.id);
    } else if (data.cellName == "sku_code" && authTypeValue == 4 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "sku", data.value.id);
    }
    if (!flag) {
      cb.utils.alert("已有相同选项,请勿重复选择!");
      return false;
    }
    if (data.cellName == "sku_code") {
      if (data.value != null) {
        let materialCode = authRangeGridModel.getCellValue(data.rowIndex, "materialCode");
        if (data.value.code == materialCode) {
          cb.utils.alert("该物料未启用多规格sku,请检查");
          return false;
        }
      }
    }
  });
  //保存控制，如果此组织已经进行过经营范围控制，那么无需再次创建
  viewModel.on("beforeSave", function (data) {
    let returnPromise = new cb.promise();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.fieldsUnique",
      {
        id: viewModel.get("id").getValue(),
        tableUri: "GT22176AT10.GT22176AT10.sy01_business_scope",
        fields: {
          org_id: {
            value: viewModel.get("org_id").getValue()
          }
        }
      },
      function (err, res) {
        if (err != undefined) {
          returnPromise.reject();
          cb.utils.alert(err.message, "error");
        }
        if (res != undefined) {
          if (res.repeat == true) {
            returnPromise.reject();
            cb.utils.alert("此组织已经配置过经营范围", "error");
          } else {
            returnPromise.resolve();
          }
        }
      }
    );
    return returnPromise;
  });
  let switchDisplayFields = function (gridModel, number) {
    number = parseInt(number);
    let fields = ["material_name", "materialCode", "sku_code", "skuName", "materialType_catagoryname", "dosage_dosagaFormName"];
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
    }
    switch (number) {
      case 1:
        gridModel.setColumnState("material_name", "visible", true);
        gridModel.setColumnState("materialCode", "visible", true);
        break;
      case 2:
        gridModel.setColumnState("materialType_catagoryname", "visible", true);
        break;
      case 3:
        gridModel.setColumnState("dosage_dosagaFormName", "visible", true);
        break;
      case 4:
        gridModel.setColumnState("material_name", "visible", true);
        gridModel.setColumnState("materialCode", "visible", true);
        gridModel.setColumnState("sku_code", "visible", true);
        gridModel.setColumnState("skuName", "visible", true);
        break;
    }
  };
  //孙表判断重复
  let validateRangeRepeat = function (rows, idFieldName, value) {
    let set = new Set();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][idFieldName] != "" && rows[i][idFieldName] != null && rows[i][idFieldName] != undefined && rows[i]._status != "Delete") {
        set.add(rows[i][idFieldName]);
      }
    }
    return set.has(value);
  };
});