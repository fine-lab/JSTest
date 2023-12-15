run = function (event) {
  var viewModel = this;
  var extend_is_gspModel = viewModel.get("extend_isgsp");
  var disAbledArr = [
    "extend_isgsp",
    "extend_khfl_typename",
    "extend_khfl",
    "extend_dzjgbm",
    "extend_zlbztx",
    "extend_zyzz",
    "extend_xgyz",
    "extend_is_gsp",
    "extend_caigouweituoshu",
    "extend_qyswdjz",
    "extend_gxysgz",
    "extend_zlbzxy",
    "extend_gxysfz",
    "extend_zzjgdz",
    "extend_ypjyqyxkz",
    "extend_gxht",
    "extend_ndbg"
  ];
  viewModel.on("afterMount", function () {
    viewModel.on("beforeAttachment", function (params) {
      if (params.childrenField != undefined && params.childrenField == "sy01_kh_other_reportList") {
        params.objectName = "mdf";
      }
    });
    viewModel.on("afterLoadData", function () {
      var extend_is_gspModel = viewModel.get("extend_isgsp");
      if (extend_is_gspModel.getValue() == true || extend_is_gspModel.getValue() == "true") {
        switchDisplayContainer(true);
      } else {
        switchDisplayContainer(false);
      }
      if (viewModel.getParams().mode == "edit") {
        if (viewModel.get("extend_syzt").getValue() == 1 || viewModel.get("extend_syzt").getValue() == "1") {
          for (let i = 0; i < disAbledArr.length; i++) {
            viewModel.get(disAbledArr[i]).setReadOnly(true);
          }
        }
      }
    });
    extend_is_gspModel.on("afterValueChange", function (data) {
      if (extend_is_gspModel.getValue() == true || extend_is_gspModel.getValue() == "true") {
        switchDisplayContainer(true);
      } else {
        switchDisplayContainer(false);
      }
    });
  });
  viewModel.on("modeChange", function (data) {
    if (data == "edit") {
      if (viewModel.get("extend_syzt").getValue() == 1 || viewModel.get("extend_syzt").getValue() == "1") {
        for (let i = 0; i < disAbledArr.length; i++) {
          viewModel.get(disAbledArr[i]).setState("bCanModify", false);
        }
      }
    }
  });
  viewModel.get("extend_khfl_typename").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("createOrg").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "org_id",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  var zzGridModelName = "sy01_kh_xgzzList";
  var zzFieldCellName = "extend_zzmc_licenseName";
  var zzsqlxFieldCellName = "extend_sqlx";
  var zzfw_gridModel = viewModel.getGridModel("sy01_kh_xgzz_fwList");
  //相关证照切换时，删除孙表
  viewModel.getGridModel(zzGridModelName).on("beforeCellValueChange", function (data) {
    if (data.cellName == zzFieldCellName) {
      if ((data.value.hasOwnProperty("id") && viewModel.getGridModel(zzGridModelName).getCellValue(data.rowIndex, zzFieldCellName) != data.value.id) || !data.value.hasOwnProperty("id")) {
        zzfw_gridModel.deleteAllRows();
      }
    }
    return true;
  });
  //相关证照切换时，将列换成对应的参照
  viewModel.getGridModel(zzGridModelName).on("afterCellValueChange", function (data) {
    if (data.cellName == zzFieldCellName) {
      let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(data.rowIndex, zzsqlxFieldCellName);
      switchDisplayFields(zzfw_gridModel, sqType - 1);
    }
  });
  //初始化时参照查询值
  zzfw_gridModel.on("beforeSetDataSource", function (data) {
    let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(viewModel.getGridModel(zzGridModelName).getFocusedRowIndex(), zzsqlxFieldCellName);
    switchDisplayFields(zzfw_gridModel, sqType - 1);
  });
  //相关证照切换时，删除孙表
  var authEntrustGridModelName = "sy01_khsqwtsList";
  var authEntrustTypeCellName = "extend_sqlx";
  var authEntrustGridModel = viewModel.getGridModel(authEntrustGridModelName);
  var authRangeGridModel = viewModel.getGridModel("sy01_khsqwts_sqfwList");
  authEntrustGridModel
    .getEditRowModel()
    .get(authEntrustTypeCellName)
    .on("blur", function (data) {
      //清空范围
      authRangeGridModel.deleteAllRows();
      let sqType = authEntrustGridModel.getCellValue(authEntrustGridModel.getFocusedRowIndex(), authEntrustTypeCellName);
      authRangeGridModel.setColumnState("extend_sqfw", "visible", false);
      switchDisplayFields(authRangeGridModel, sqType - 1);
    });
  //初始化时参照查询值
  authRangeGridModel.on("beforeSetDataSource", function (data) {
    let sqType = authEntrustGridModel.getCellValue(authEntrustGridModel.getFocusedRowIndex(), authEntrustTypeCellName);
    authRangeGridModel.setColumnState("extend_sqfw", "visible", false);
    switchDisplayFields(authRangeGridModel, sqType - 1);
  });
  viewModel.on("beforeDelete", function (data) {
    let syzt = viewModel.get("extend_syzt").getValue();
    if (syzt == 1 || syzt == "1") {
      cb.utils.alert("此客户已经通过首营，不能删除", "error");
      return false;
    }
  });
  switchDisplayFields = function (gridModel, number) {
    let fields = ["extend_pro_auth_type_name", "extend_protype_auth_type_catagoryname", "extend_dosage_auth_type_dosagaFormName", "item770oj", "item809xb", "item849ii", "item869bh"];
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
    }
    switch (number) {
      case 0:
        gridModel.setColumnState("extend_pro_auth_type_name", "visible", true);
        gridModel.setColumnState("item770oj", "visible", true);
        gridModel.setColumnState("item809xb", "visible", true);
        gridModel.setColumnState("item849ii", "visible", true);
        gridModel.setColumnState("item869bh", "visible", true);
        break;
      case 1:
        gridModel.setColumnState("extend_protype_auth_type_catagoryname", "visible", true);
        break;
      case 2:
        gridModel.setColumnState("extend_dosage_auth_type_dosagaFormName", "visible", true);
        break;
    }
  };
  function switchDisplayContainer(flag) {
    viewModel.execute("updateViewMeta", {
      code: "group73pd", // 容器的编码（从UI设计器属性栏查看）
      visible: flag
    });
    viewModel.execute("updateViewMeta", {
      code: "group69yc", // 容器的编码（从UI设计器属性栏查看）
      visible: flag
    });
    viewModel.execute("updateViewMeta", {
      code: "group85xc", // 容器的编码（从UI设计器属性栏查看）
      visible: flag
    });
    viewModel.execute("updateViewMeta", {
      code: "group96uk", // 容器的编码（从UI设计器属性栏查看）
      visible: flag
    });
  }
};