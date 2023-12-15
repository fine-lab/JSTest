let gridModel = viewModel.getGridModel("SY01_warehousedev2List");
viewModel.get("button64ka").on("click", function (data) {
  var ids = [];
  var user = viewModel.getAppContext().user;
  var tenantid = viewModel.getAppContext().tenant.tenantId;
  var userid = user.userId;
  let id = viewModel.get("id").getValue();
  let verifystate = viewModel.get("verifystate").getValue();
  let code = viewModel.get("code").getValue();
  if (verifystate != 0) {
    cb.utils.alert("单据编号:" + code + ",非开立态不能进行审批！", "error");
    return;
  }
  ids.push(id);
  batchAudit(ids, userid, tenantid);
});
viewModel.get("button40og").on("click", function (data) {
  var ids = [];
  var user = viewModel.getAppContext().user;
  var tenantid = viewModel.getAppContext().tenant.tenantId;
  var userid = user.userId;
  let id = viewModel.get("id").getValue();
  let verifystate = viewModel.get("verifystate").getValue();
  let code = viewModel.get("code").getValue();
  if (verifystate != 2) {
    cb.utils.alert("单据编号:" + code + ",非审核态不能进行弃审！", "error");
    return;
  }
  ids.push(id);
  batchUnAudit(ids, userid, tenantid);
});
var batchAudit = function (ids, userid, tenantid) {
  return new Promise(function (resolve) {
    var queryProxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/gsp/batchauditMaintainRecord",
        method: "POST",
        options: {
          domainKey: "sy01",
          async: false
        }
      }
    });
    var paramsQuery = {
      ids: ids,
      userid: userid,
      tenantid: tenantid
    };
    var result = queryProxy.settle(paramsQuery);
    debugger;
    if (result.error != undefined && result.error.code == "999") {
      cb.utils.alert("审核出错误：" + result.error.message, "error");
      return;
    } else {
      cb.utils.alert("审批成功", "success");
      viewModel.execute("refresh");
    }
    let Ids = result.result.id;
    resolve(Ids);
  });
};
var batchUnAudit = function (ids, userid, tenantid) {
  return new Promise(function (resolve) {
    var queryProxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/gsp/batchunauditMaintainRecord",
        method: "POST",
        options: {
          domainKey: "sy01",
          async: false
        }
      }
    });
    var paramsQuery = {
      ids: ids,
      userid: userid,
      tenantid: tenantid
    };
    var result = queryProxy.settle(paramsQuery);
    debugger;
    if (result.error != undefined && result.error.code == "999") {
      cb.utils.alert("弃审出错误：" + result.error.message, "error");
      return;
    } else {
      cb.utils.alert("弃审成功", "success");
      viewModel.execute("refresh");
    }
    let Ids = result.result.id;
    resolve(Ids);
  });
};
viewModel.on("modeChange", function (data) {
  if (data === "add") {
    //获取当前用户对应的员工，赋值给复核人员
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getStaffOfCurUser",
      {
        mainOrgId: viewModel.get("org_id").getValue()
      },
      function (err, res) {
        if (res != undefined && res.staffOfCurrentUser != undefined) {
          viewModel.get("personnel").setValue(res.staffOfCurrentUser.id);
          viewModel.get("personnel_name").setValue(res.staffOfCurrentUser.name);
          viewModel.get("yh_department").setValue(res.staffOfCurrentUser.deptId);
          viewModel.get("yh_department_name").setValue(res.staffOfCurrentUser.deptName);
        }
      }
    );
  }
});
viewModel.get("org_id_name").on("afterValueChange", function (args) {
  debugger;
  let orgId = viewModel.get("org_id").getValue();
  cb.rest.invokeFunction("GT22176AT10.publicFunction.getOrgInfo", { orgId: orgId }, function (err, res) {
    if (res != undefined && res.financeOrginfo != undefined) {
      viewModel.get("accounting_entity").setValue(res.financeOrginfo.id);
      viewModel.get("accounting_entity_name").setValue(res.financeOrginfo.name.zh_CN);
    }
  });
});
gridModel
  .getEditRowModel()
  .get("code_ph_batchno")
  .on("beforeBrowse", function () {
    let index = gridModel.getFocusedRowIndex();
    let product = gridModel.getCellValue(index, "material_code");
    let orgId = viewModel.get("org_id").getValue();
    let warehouse = gridModel.getCellValue(index, "warehouse");
    if (product == undefined) {
      cb.utils.alert("请先选择物料", "error");
      return false;
    } else {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      //是否gsp物料
      condition.simpleVOs.push(
        {
          field: "product",
          op: "eq",
          value1: product
        },
        {
          field: "org",
          op: "eq",
          value1: orgId
        },
        {
          field: "warehouse",
          op: "eq",
          value1: warehouse
        }
      );
      this.setFilter(condition);
    }
  });
gridModel
  .getEditRowModel()
  .get("sku_id_code")
  .on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let authProduct = gridModel.getEditRowModel().get("material_code").getValue();
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
gridModel
  .getEditRowModel()
  .get("position_name")
  .on("beforeBrowse", function (data) {
    let warehouse = viewModel.get("warehouse").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "warehouseId",
      op: "eq",
      value1: warehouse
    });
    //设置过滤条件
    this.setFilter(condition);
  });
gridModel.on("afterCellValueChange", function (args) {
  let cellName = args.cellName;
  let rowIndex = args.rowIndex;
  if (cellName == "yhbhgsl") {
    let curingNumber = gridModel.getCellValue(rowIndex, "curing_number");
    let yhbhgsl = gridModel.getCellValue(rowIndex, "yhbhgsl");
    let yhhgsl = gridModel.getCellValue(rowIndex, "yhhgsl");
    let yhbqdsl = gridModel.getCellValue(rowIndex, "yhbqdsl");
    if (yhbhgsl > curingNumber) {
      gridModel.setCellValue(rowIndex, "yhbhgsl", 0);
      cb.utils.alert("养护不合格数量不能大于本次养护数量！");
      return false;
    }
    gridModel.setCellValue(rowIndex, "yhhgsl", curingNumber - yhbhgsl - yhbqdsl);
  } else if (cellName == "yhhgsl") {
    let curingNumber = gridModel.getCellValue(rowIndex, "curing_number");
    let yhbhgsl = gridModel.getCellValue(rowIndex, "yhbhgsl");
    let yhbqdsl = gridModel.getCellValue(rowIndex, "yhbqdsl");
    let yhhgsl = gridModel.getCellValue(rowIndex, "yhhgsl");
    if (yhhgsl > curingNumber) {
      gridModel.setCellValue(rowIndex, "yhhgsl", 0);
      cb.utils.alert("养护合格数量不能大于本次养护数量！");
      return false;
    }
    gridModel.setCellValue(rowIndex, "yhbhgsl", curingNumber - yhhgsl - yhbqdsl);
  } else if (cellName == "yhbqdsl") {
    let curingNumber = gridModel.getCellValue(rowIndex, "curing_number");
    let yhbhgsl = gridModel.getCellValue(rowIndex, "yhbhgsl");
    let yhbqdsl = gridModel.getCellValue(rowIndex, "yhbqdsl");
    let yhhgsl = gridModel.getCellValue(rowIndex, "yhhgsl");
    if (yhbqdsl > curingNumber) {
      gridModel.setCellValue(rowIndex, "yhbqdsl", 0);
      cb.utils.alert("养护不确定数量不能大于本次养护数量！");
      return false;
    }
  }
});
viewModel.get("yh_department_name").on("beforeBrowse", function (data) {
  var externalData = {};
  externalData.ref_parentorgid = viewModel.get("org_id").getValue();
  (externalData.funcCode = "all"), (externalData.accountdelegate = "true"), viewModel.get("yh_department_name").setState("externalData", externalData);
});
//部门切换，或清空，清空验收员
viewModel.get("yh_department_name").on("afterValueChange", function (data) {
  if (data.value == null || (data.oldValue != null && data.value.id != data.oldValue.id)) {
    viewModel.get("personnel").setValue(null);
    viewModel.get("personnel_name").setValue(null);
  }
});
let selectMerchandise = function (orgId, finOrg) {
  return new Promise((resolve, reject) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.getMaterialFile", { orgId: orgId, finOrg: finOrg }, function (err, res) {
      if (typeof res != "undefined") {
        resolve(res.huopinIds);
      } else if (typeof err != "undefined") {
        reject(err.message);
      }
    });
  });
};
gridModel
  .getEditRowModel()
  .get("material_code_code")
  .on("beforeBrowse", function (data) {
    let warehouse_name = viewModel.get("warehouse_name").getValue();
    if (undefined == warehouse_name) {
      cb.utils.alert("请选择仓库");
      return false;
    }
    let orgId = viewModel.get("org_id").getValue();
    let finOrg = viewModel.get("accounting_entity").getValue();
    let returnPromise = new cb.promise();
    selectMerchandise(orgId, finOrg).then(
      (data) => {
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push(
          {
            field: "id",
            op: "in",
            value1: data
          },
          {
            field: "productApplyRange.productDetailId.stopstatus",
            op: "in",
            value1: 0
          },
          {
            field: "isDeleted",
            op: "in",
            value1: [0, "0", false, "false"]
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
viewModel.on("afterLoadData", function (args) {
  let verifystate = viewModel.get("verifystate").getValue();
  if (verifystate == 1) {
    viewModel.get("dropdownbutton22xg").setVisible(false);
  } else {
    viewModel.get("dropdownbutton22xg").setVisible(true);
  }
  if (verifystate == 2) {
    viewModel.get("button40og").setVisible(true);
    viewModel.get("button64ka").setVisible(false);
  } else {
    if (verifystate == 0) {
      viewModel.get("button40og").setVisible(false);
      viewModel.get("button64ka").setVisible(true);
    }
  }
});
let queryBatchInDate = function (orgId, batchNo) {
  return new Promise((resolve, reject) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.queryBatchInDate", { orgId: orgId, batchNo: batchNo }, function (err, res) {
      if (typeof res != "undefined") {
        resolve(res.result);
      } else if (typeof err != "undefined") {
        reject(err.message);
      }
    });
  });
};
viewModel.on("afterMount", function () {
  viewModel.get("personnel_name").on("beforeBrowse", function (data) {
    //获取商品档案详情
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: orgId
    });
    //设置过滤条件
    this.setFilter(condition);
  });
  viewModel.get("warehouse_name").on("afterValueChange", function (data) {
    gridModel.setColumnValue("warehouse_name", data.value);
  });
});
viewModel.on("beforeSave", function () {
  let errorMsg = "";
  let bhgslArr = [];
  let handerMessage = (n) => (errorMsg += n);
  for (var i = 0; i < gridModel.getRows().length; i++) {
    //在库养护数量
    let curing_number = parseFloat(gridModel.getCellValue(i, "curing_number"));
    //在库养护合格数量
    let yhhgsl = parseFloat(gridModel.getCellValue(i, "yhhgsl"));
    //在库养护不合格数量
    let yhbhgsl = parseFloat(gridModel.getCellValue(i, "yhbhgsl"));
    if (yhbhgsl > 0) {
      bhgslArr.push(yhbhgsl);
    }
    //在库养护不确定数量
    let yhbqdsl = parseFloat(gridModel.getCellValue(i, "yhbqdsl"));
    if (curing_number <= 0) {
      errorMsg += "第" + (i + 1) + "行数据 数量不能 <= 0\n";
      cb.utils.alert(errorMsg);
      return false;
    } else {
      if (curing_number != yhhgsl + yhbhgsl + yhbqdsl) {
        errorMsg += "第" + (i + 1) + "行数据 养护合格数量+养护不合格数量+养护不确定数量 != 在库养护数量,请重新填写 \n ";
        cb.utils.alert(errorMsg);
        return false;
      }
    }
  }
  if (bhgslArr.length > 0) {
    viewModel.get("is_have_bhg").setValue("1");
  } else {
    viewModel.get("is_have_bhg").setValue("0");
  }
});
viewModel.on("beforePush", function (data) {
  let uncertainQty = {};
  let unqualifiedQty = {};
  console.log(data.params.cSvcUrl);
  let verifystate = viewModel.get("verifystate").getValue();
  if (verifystate == 2) {
    //下推质量复查
    if (data.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      for (let i = 0; i < gridModel.getRows().length; i++) {
        //养护计划子表ID
        let mainprocChildId = gridModel.getCellValue(i, "id");
        //在库养护不合格数量
        let yhbhgsl = parseFloat(gridModel.getCellValue(i, "yhbhgsl"));
        //在库养护不确定数量
        let yhbqdsl = parseFloat(gridModel.getCellValue(i, "yhbqdsl"));
        //关联不合格登记
        let glbhgdjsl = parseFloat(gridModel.getCellValue(i, "glbhgdjsl"));
        //关联复查数量
        let glfcsl = parseFloat(gridModel.getCellValue(i, "glfcsl"));
        //剩余不确定数量
        let warehouseCurUncertainQty = parseFloat(yhbqdsl - glfcsl);
        uncertainQty[mainprocChildId] = warehouseCurUncertainQty;
      }
      let id = viewModel.get("id").getValue(); //主表ID
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.warehousePushReview",
        {
          id: id,
          uncertainQty: uncertainQty
        },
        function (err, res) {
          if (typeof res != "undefined") {
            if (res.error_info.length > 0) {
              cb.utils.alert(res.error_info);
              promise.reject();
            }
            promise.resolve();
          } else if (err !== null) {
            cb.utils.alert(err);
            promise.reject();
          }
        }
      );
      return promise;
    }
    //下推不合格登记
    else if (data.params.cSvcUrl.indexOf("targetBillNo=3837a6e9") > 0) {
      for (let i = 0; i < gridModel.getRows().length; i++) {
        //养护计划子表ID
        let mainprocChildId = gridModel.getCellValue(i, "id");
        //在库养护不合格数量
        let yhbhgsl = parseFloat(gridModel.getCellValue(i, "yhbhgsl"));
        //累计复查不合格数量
        let glfcbhgsl = parseFloat(gridModel.getCellValue(i, "glfcbhgsl"));
        //在库养护不确定数量
        let yhbqdsl = parseFloat(gridModel.getCellValue(i, "yhbqdsl"));
        //关联不合格登记
        let glbhgdjsl = parseFloat(gridModel.getCellValue(i, "glbhgdjsl"));
        //关联复查数量
        let glfcsl = parseFloat(gridModel.getCellValue(i, "glfcsl"));
        //剩余不合格数量
        let warehouseCurUnqualifiedQty = parseFloat(yhbhgsl + glfcbhgsl - glbhgdjsl);
        unqualifiedQty[mainprocChildId] = warehouseCurUnqualifiedQty;
      }
      let id = viewModel.get("id").getValue(); //主表ID
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.warehousePushUnqual",
        {
          id: id,
          unqualifiedQty: unqualifiedQty
        },
        function (err, res) {
          if (typeof res != "undefined") {
            if (res.error_info.length > 0) {
              cb.utils.alert(res.error_info);
              promise.reject();
              return false;
            }
            promise.resolve();
          } else if (err !== null) {
            cb.utils.alert(err);
            promise.reject();
            return false;
          }
        }
      );
      return promise;
    }
  } else {
    cb.utils.alert("该单据未审核,下推失败");
    return false;
  }
});