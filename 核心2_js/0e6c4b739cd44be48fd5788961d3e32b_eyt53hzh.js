run = function (event) {
  var viewModel = this;
  let switchDisplayFields = function (gridModel, number) {
    number = parseInt(number);
    let fields = ["authProduct_name", "authProductType_catagoryname", "authDosageForm_dosagaFormName", "authSku_name", "item89kk"];
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
      gridModel.setColumnState(fields[i], "bCanModify", false);
    }
    switch (number) {
      case 1:
        gridModel.setColumnState("authProduct_name", "visible", true);
        gridModel.setColumnState("authProduct_name", "bCanModify", true);
        break;
      case 2:
        gridModel.setColumnState("authProductType_catagoryname", "visible", true);
        gridModel.setColumnState("authProductType_catagoryname", "bCanModify", true);
        break;
      case 3:
        gridModel.setColumnState("authDosageForm_dosagaFormName", "visible", true);
        gridModel.setColumnState("authDosageForm_dosagaFormName", "bCanModify", true);
        break;
      case 4:
        gridModel.setColumnState("authSku_name", "visible", true);
        gridModel.setColumnState("authSku_name", "bCanModify", true);
        gridModel.setColumnState("authProduct_name", "visible", true);
        gridModel.setColumnState("authProduct_name", "bCanModify", true);
        gridModel.setColumnState("item89kk", "visible", true);
        gridModel.setColumnState("item89kk", "bCanModify", false);
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
  let zzfw_gridModel = viewModel.getGridModel("SY01_personal_licensen_sunList");
  var zzGridModelName = "SY01_personal_licensen_childList";
  var zzsqlxFieldCellName = "authType";
  //相关证照切换时，删除所有孙表，将列换成对应的参照
  viewModel.getGridModel(zzGridModelName).on("afterCellValueChange", function (data) {
    if (data.cellName == zzsqlxFieldCellName && data.value != data.oldValue) {
      zzfw_gridModel.deleteAllRows();
      let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(data.rowIndex, zzsqlxFieldCellName);
      switchDisplayFields(zzfw_gridModel, sqType);
    }
  });
  //初始化时参照查询值
  zzfw_gridModel.on("beforeSetDataSource", function (data) {
    let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(viewModel.getGridModel(zzGridModelName).getFocusedRowIndex(), zzsqlxFieldCellName);
    switchDisplayFields(zzfw_gridModel, sqType);
  });
  zzfw_gridModel.on("beforeCellValueChange", function (data) {
    let rows = zzfw_gridModel.getRows();
    let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(viewModel.getGridModel(zzGridModelName).getFocusedRowIndex(), zzsqlxFieldCellName);
    if (sqType == undefined) {
      cb.utils.alert("请先选择授权范围");
      return false;
    }
    let flag = true;
    if (data.cellName == "authProduct_name" && sqType == 1 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "authProduct", data.value.id);
    } else if (data.cellName == "authProductType_catagoryname" && sqType == 2 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "authProductType", data.value.id);
    } else if (data.cellName == "extend_dosage_auth_type_dosagaFormName" && sqType == 3 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "authDosageForm", data.value.id);
    } else if (data.cellName == "authSku_name" && sqType == 4 && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "authSku", data.value.id);
    }
    if (!flag) {
      cb.utils.alert("已有相同选项,请勿重复选择!");
      return false;
    }
  });
  zzfw_gridModel.on("afterCellValueChange", function (data) {
    if (data.cellName == "authProductType_catagoryname") {
      zzfw_gridModel.setCellValue(data.rowIndex, "authSku", null);
      zzfw_gridModel.setCellValue(data.rowIndex, "authSku_name", null);
    }
  });
  let selectParamOrg = function () {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("ISY_2.public.getParamInfo", {}, function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let paramRres = res.paramRes;
          resolve(paramRres);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  let selectMerchandise = function (orgId) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getMerchandise", { orgId: orgId }, function (err, res) {
        let data;
        if (typeof res != "undefined") {
          let resInfo = res.huopinIds;
          resolve(resInfo);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  //组织过滤
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    debugger;
    let returnPromise = new cb.promise();
    selectParamOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            orgId.push(data[i].org_id);
          }
        }
        let treeCondition = {
          isExtend: true,
          simpleVOs: []
        };
        if (orgId.length > 0) {
          treeCondition.simpleVOs.push({
            field: "id",
            op: "in",
            value1: orgId
          });
        }
        this.setTreeFilter(treeCondition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  //供应商过滤
  viewModel.get("supplierName_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "vendorApplyRange.org",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  //授权范围-物料过滤
  zzfw_gridModel
    .getEditRowModel()
    .get("authProduct_name")
    .on("beforeBrowse", function (data) {
      let orgId = viewModel.get("org_id").getValue();
      let type = "授权委托书范围";
      let promises = [];
      let huopinRes = [];
      let idObjects = [];
      promises.push(
        selectMerchandise(orgId).then((res) => {
          huopinRes = res;
        })
      );
      let returnPromise = new cb.promise();
      Promise.all(promises).then(
        () => {
          let proIds = [];
          if (huopinRes.length == 0) {
            proIds.push("-1");
          }
          for (let j = 0; j < huopinRes.length; j++) {
            proIds.push(huopinRes[j]);
          }
          let condition = {
            isExtend: true,
            simpleVOs: []
          };
          condition.simpleVOs.push(
            {
              field: "id",
              op: "in",
              value1: proIds
            },
            {
              field: "isDeleted",
              op: "in",
              value1: ["false", false, 0, "0"]
            },
            {
              field: "productApplyRange.productDetailId.stopstatus",
              op: "in",
              value1: 0
            }
          );
          this.setFilter(condition);
          returnPromise.resolve();
        },
        (err) => {
          cb.utils.alert(err, "error");
          returnPromise.reject();
        }
      );
      return returnPromise;
    });
  //授权范围-物料SKU过滤
  zzfw_gridModel
    .getEditRowModel()
    .get("authSku_name")
    .on("beforeBrowse", function (data) {
      let orgId = viewModel.get("org_id").getValue();
      let authProduct = zzfw_gridModel.getEditRowModel().get("authProduct").getValue();
      let type = "授权委托书范围";
      let promises = [];
      let huopinRes = [];
      let idObjects = [];
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push(
        {
          field: "productId",
          op: "eq",
          value1: authProduct
        },
        {
          field: "productId.productApplyRange.orgId",
          op: "eq",
          value1: orgId
        }
      );
      this.setFilter(condition);
    });
  //保存后将授权范围同步给合格供应商的授权范围
  viewModel.on("afterSave", function () {
    let id = viewModel.get("id").getValue(); //人员证照id
    synSupplyAuthCope(id).then((res) => {});
  });
  function synSupplyAuthCope(personId) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction(
        "ISY_2.public.synAuthCope",
        {
          mainId: personId,
          synType: 1
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (res != null) {
            resolve();
          } else if (err != null) {
            reject();
          }
        }
      );
    });
  }
  viewModel.on("beforeSave", function () {
    let childIndex = viewModel.getGridModel(zzGridModelName).getRows();
    if (childIndex.length > 1) {
      cb.utils.alert("一个证照只能授权一个类型");
      return false;
    }
  });
};