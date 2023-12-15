viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  //保存初始化时每行的复核数量
  var originCheckNumMap = new Map();
  viewModel.on("beforePush", function (args) {
    if (args.args.cSvcUrl.indexOf("targetBillNo=3837a6e9") > 0) {
      var returnPromise = new cb.promise();
      var id = viewModel.get("id").getValue();
      var uri = "GT22176AT10.GT22176AT10.SY01_bad_drugv7";
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.pushCheck4Sales", { id: id }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        }
        if (res.errInfo && res.errInfo.length > 0) {
          cb.utils.alert(res.errInfo, "error");
          return false;
        }
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.outOfRoomToNoGood", { id: id }, function (err, res) {
          if (res.resultNumb < 0) {
            cb.utils.alert("不合格数量有误", "error");
            return false;
          }
          returnPromise.resolve();
        });
      });
      return returnPromise;
      // 质量复查单对应判断逻辑
    } else if (args.args.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      var returnPromise = new cb.promise();
      // 获取退回检验单的ID
      var thisSoutId = viewModel.get("id").getValue();
      var thisCode = viewModel.get("code").getValue();
      // 调用校验API函数
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.validSoutPushCheck", { soutId: thisSoutId, upBillCode: thisCode }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        }
        if (res.errInfo && res.errInfo.length > 0) {
          cb.utils.alert(res.errInfo, "error");
          return false;
        }
        returnPromise.resolve();
      });
      return returnPromise;
    }
  });
  //保存下推时复核数量
  viewModel.on("afterLoadData", function (args) {
    let verifystate = viewModel.get("verifystate").getValue();
    if (verifystate == 1) {
      viewModel.get("dropdownbuttonAudit").setVisible(false);
    } else {
      viewModel.get("dropdownbuttonAudit").setVisible(true);
    }
    if (verifystate == 2) {
      viewModel.get("buttonUnAudit").setVisible(true);
      viewModel.get("buttonAudit").setVisible(false);
    } else {
      if (verifystate == 0) {
        viewModel.get("buttonUnAudit").setVisible(false);
        viewModel.get("buttonAudit").setVisible(true);
      }
    }
    originCheckNumMap = new Map();
    var rows = viewModel.getGridModel().getAllData();
    var gridModel = viewModel.getGridModel();
    for (let i = 0; i < rows.length; i++) {
      let key = rows[i].sourcechild_id + "|" + rows[i].item132yh;
      originCheckNumMap.set(key, (originCheckNumMap.get(key) == undefined ? 0 : originCheckNumMap.get(key)) + rows[i].checkNum);
      //商品分类
      let gsp_material_type = gridModel.getCellValue(i, "extendGspPrdType");
      if (gsp_material_type != null) {
        getMaterialType(gsp_material_type).then((res) => {
          if (res != null && res.length > 0) {
            gridModel.setCellValue(i, "parentProType", res[0].catagoryname);
          }
        });
      }
    }
    //初始化二次复核人和密码、隐藏密码字段
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].doubleCheck == "false" || rows[i].doubleCheck == "0" || !rows[i].doubleCheck) {
        gridModel.setCellValue(i, "checkerPasswordHidden", "");
        gridModel.setCellValue(i, "checkerPassword", "");
        gridModel.setCellValue(i, "doubleCheckMan_name", "");
        gridModel.setCellValue(i, "doubleCheckMan", "");
        gridModel.setCellState(i, "doubleCheckMan_name", "readOnly", true);
        gridModel.setCellState(i, "checkerPassword", "readOnly", true);
        gridModel.setCellState(i, "features", "readOnly", false);
      }
    }
    //初始化二次复核人和密码、隐藏密码字段
    if (args.source_billtype != undefined && args.source_billtype == "ST.st_salesout") {
    }
    let mode = viewModel.getParams().mode;
    if (mode == "add") {
      for (let i = 0; i < rows.length; i++) {
        let mrfDate = gridModel.getCellValue(i, "mrfDate");
        let validityTo = gridModel.getCellValue(i, "validityTo");
        if (undefined != mrfDate && "" != mrfDate) {
          gridModel.setCellValue(i, "mrfDate", new Date(mrfDate).format("yyyy-MM-dd"));
        }
        if (undefined != validityTo && "" != validityTo) {
          gridModel.setCellValue(i, "validityTo", new Date(validityTo).format("yyyy-MM-dd"));
        }
      }
    }
    if (mode == "add") {
      let recheckMan = viewModel.get("recheckMan").getValue();
      let recheckDept = viewModel.get("recheckDept").getValue();
      if (recheckMan == "" || recheckMan == null) {
        //获取当前用户对应的员工，赋值给复核人员
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined && res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhr == undefined) {
            viewModel.get("recheckMan").setValue(res.staffOfCurrentUser.id, true);
            viewModel.get("recheckMan_name").setValue(res.staffOfCurrentUser.name, true);
            if (recheckDept == "" || recheckDept == null) {
              viewModel.get("recheckDept").setValue(res.staffOfCurrentUser.deptId, true);
              viewModel.get("recheckDept_name").setValue(res.staffOfCurrentUser.deptName, true);
            }
          }
          if (res != undefined && res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhr != undefined) {
            viewModel.get("recheckMan").setValue(res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhr, true);
            viewModel.get("recheckMan_name").setValue(res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrName, true);
            viewModel.get("recheckDept").setValue(res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrDep, true);
            viewModel.get("recheckDept_name").setValue(res.staffOfCurrentUser.GSPConfigDefaultUser.defaultFhrDepName, true);
          }
        });
      }
      //查询所有医药物料档案
      let productIds = [];
      rows.forEach((rowItem) => {
        productIds.push(rowItem.material);
      });
      let invoiceOrg = rows[0].detailSettlementOrgId;
      let promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.exWhRecheckInit",
        {
          invoiceOrg: invoiceOrg,
          productIds: productIds
        },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          } else {
            let productInfors = res.productInfors;
            if (productInfors != undefined && productInfors.length > 0) {
              for (let i = 0; i < productInfors.length; i++) {
                for (let j = 0; j < rows.length; j++) {
                  if (productInfors[i].material == rows[j].material) {
                    if (productInfors[i].doubleReview == "1") {
                      gridModel.setCellValue(j, "doubleCheck", true);
                      gridModel.setCellState(j, "doubleCheckMan_name", "readOnly", false);
                      gridModel.setCellState(j, "checkerPassword", "readOnly", false);
                    } else {
                      gridModel.setCellValue(j, "doubleCheck", false);
                      gridModel.setCellValue(j, "checkerPasswordHidden", "");
                      gridModel.setCellValue(j, "checkerPassword", "");
                      gridModel.setCellValue(j, "doubleCheckMan_name", "");
                      gridModel.setCellValue(j, "doubleCheckMan", "");
                      gridModel.setCellState(j, "doubleCheckMan_name", "readOnly", true);
                      gridModel.setCellState(j, "checkerPassword", "readOnly", true);
                    }
                  }
                }
              }
            }
            promise.resolve();
          }
        }
      );
      return promise;
    }
  });
  viewModel.on("afterMount", function () {
    var gridModel = viewModel.getGridModel();
    gridModel.setColumnState("checkerPassword", "type", "password");
    //人员过滤
    viewModel.get("recheckMan_name").on("beforeBrowse", function () {
      // 获取组织id
      const value = viewModel.get("org_id").getValue();
      let dep_id = viewModel.get("recheckDept").getValue();
      // 实现选择用户的组织id过滤
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      if (dep_id != null) {
        condition.simpleVOs.push({
          field: "mainJobList.dept_id",
          op: "eq",
          value1: dep_id
        });
      } else {
        condition.simpleVOs.push({
          field: "mainJobList.org_id",
          op: "eq",
          value1: value
        });
      }
      this.setFilter(condition);
    });
    //复核人员选择完之后，自动带出部门
    viewModel.get("recheckMan_name").on("afterValueChange", function (data) {
      let dep_id = viewModel.get("recheckDept").getValue();
      if (data.value != null && dep_id == null && (data.oldValue == null || data.value.id != data.oldValue.id)) {
        viewModel.get("recheckDept").setValue(data.value.dept_id);
        viewModel.get("recheckDept_name").setValue(data.value.dept_id_name);
      }
    });
    //密码字段初始化
    gridModel.on("rowColChange", function (args) {
    });
    //编辑态下设置特征组模型不可编辑
    gridModel.on("afterSetDataSource", (args) => {
      let characteristicsKey = "yourKeyHere";
      let rows = gridModel.getRows();
      for (let i = 0; i < rows.length; i++) {
        if (gridModel.getRowModel(i) && gridModel.getRowModel(i).get(characteristicsKey)) {
          let freeCTModel = gridModel.getRowModel(i).get(characteristicsKey);
          let stateObi = { disabled: true };
          freeCTModel.on("afterCharacterModels", () => {
            setTimeout(() => {
              freeCTModel.setCharacterStatus(stateObi);
            }, 0);
          });
        }
      }
    });
    //监听生产日期和有效期至变化，格式化
    gridModel.on("afterCellValueChange", function (data) {
      if (data.cellName == "item135se_batchno" || data.cellName == "batch_no_batchno") {
        let mrfDate = gridModel.getCellValue(data.rowIndex, "mrfDate");
        let validityTo = gridModel.getCellValue(data.rowIndex, "validityTo");
        if (undefined != mrfDate && "" != mrfDate) {
          gridModel.setCellValue(data.rowIndex, "mrfDate", new Date(mrfDate).format("yyyy-MM-dd"));
        }
        if (undefined != validityTo && "" != validityTo) {
          gridModel.setCellValue(data.rowIndex, "validityTo", new Date(validityTo).format("yyyy-MM-dd"));
        }
      }
    });
    //复制行时，检验数量不复制
    gridModel.on("afterInsertRow", function (data) {
      gridModel.setCellValue(data.index, "checkNum", 0);
    });
  });
  viewModel.get("buttonAudit").on("click", function (data) {
    debugger;
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
  viewModel.get("buttonUnAudit").on("click", function (data) {
    debugger;
    var ids = [];
    var user = viewModel.getAppContext().user;
    var tenantid = viewModel.getAppContext().tenant.tenantId;
    var userid = user.userId;
    let id = viewModel.get("id").getValue();
    let verifystate = viewModel.get("verifystate").getValue();
    let code = viewModel.get("code").getValue();
    if (verifystate != 2) {
      cb.utils.alert("单据编号:" + code + ",非审核态不能进行审批！", "error");
      return;
    }
    ids.push(id);
    batchUnAudit(ids, userid, tenantid);
  });
  var batchAudit = function (ids, userid, tenantid) {
    return new Promise(function (resolve) {
      var queryProxy = cb.rest.DynamicProxy.create({
        settle: {
          url: "/gsp/batchauditsale",
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
          url: "/gsp/batchunauditsale",
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
  if (viewModel.get("button37if") != undefined) {
    viewModel.get("button37if").on("click", function (data) {
      //获取选中行的行号
      let line = data.index;
      //获取选中行数据信息
      let rowInfor = viewModel.getGridModel().getRow(line);
      let batchNo = rowInfor.batchNo;
      let prodCode = rowInfor.material_code;
      if (prodCode == undefined || batchNo == undefined) {
        cb.utils.alert("商品编码和批次号不能为空", "error");
        return false;
      }
      //传递给被打开页面的数据信息
      let billData = {
        billtype: "VoucherList", // 单据类型
        billno: "1c0a89e0", // 单据号
        params: {
          mode: "browse", // (编辑态edit、新增态add、浏览态browse)
          //传参
          rowInfor: rowInfor
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", billData, viewModel);
    });
  }
  viewModel.get("recheckDept_name").on("beforeBrowse", function (data) {
    var externalData = {};
    externalData.ref_parentorgid = viewModel.get("org_id").getValue();
    (externalData.funcCode = "all"), (externalData.accountdelegate = "true"), viewModel.get("recheckDept_name").setState("externalData", externalData);
  });
  viewModel.get("recheckDept_name").on("afterValueChange", function (data) {
    if (data.value == null || (data.oldValue != null && data.value.id != data.oldValue.id)) {
      viewModel.get("recheckMan").setValue(null);
      viewModel.get("recheckMan_name").setValue(null);
    }
  });
  //密码校验函数
  let validatePassword = (index, id, password) => {
    return new Promise(function (resolve) {
      let querySql = "select pass_ec from GT22176AT10.GT22176AT10.SY01_secondaccepter where id ='" + id + "'";
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.queryBySql", { sql: querySql }, function (err, res) {
        let message = "";
        if (err) {
          message += "密码查询接口报错";
        }
        if (typeof res != "undefined") {
          if (res.data.length > 0) {
            if (res.data[0].pass_ec == undefined || res.data[0].pass_ec != password) {
              message += "第" + (index + 1) + "行密码错误";
            }
          }
        }
        resolve(message);
      });
    });
  };
  //保存前校验
  viewModel.on("beforeSave", function (args) {
    var rows = viewModel.getGridModel().getAllData();
    if (rows.length == 0) {
      cb.utils.alert("复核明细不能为空", "error");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    //拆行后统计数量
    let lineGroupCheckNumMap = new Map();
    let sourcechildIds = [];
    let checkNumObj = {};
    let checkQualifiedNum = {};
    let checkUnqualifiedNum = {};
    let checkUncertainNum = {};
    for (let i = 0; i < rows.length; i++) {
      let index = sourcechildIds.indexOf(rows[i].sourcechild_id);
      if (index == -1) {
        sourcechildIds.push(rows[i].sourcechild_id);
        checkNumObj[rows[i].sourcechild_id] = rows[i].checkNum;
        checkQualifiedNum[rows[i].sourcechild_id] = rows[i].checkQualifiedNum == undefined ? 0 : Number.parseFloat(rows[i].checkQualifiedNum);
        checkUnqualifiedNum[rows[i].sourcechild_id] = rows[i].checkUnqualifiedNum == undefined ? 0 : Number.parseFloat(rows[i].checkUnqualifiedNum);
        checkUncertainNum[rows[i].sourcechild_id] = rows[i].checkUncertainNum == undefined ? 0 : Number.parseFloat(rows[i].checkUncertainNum);
      } else {
        checkNumObj[rows[i].sourcechild_id] += rows[i].checkNum;
        checkQualifiedNum[rows[i].sourcechild_id] += rows[i].checkQualifiedNum == undefined ? 0 : Number.parseFloat(rows[i].checkQualifiedNum);
        checkUnqualifiedNum[rows[i].sourcechild_id] += rows[i].checkUnqualifiedNum == undefined ? 0 : Number.parseFloat(rows[i].checkUnqualifiedNum);
        checkUncertainNum[rows[i].sourcechild_id] += rows[i].checkUncertainNum == undefined ? 0 : Number.parseFloat(rows[i].checkUncertainNum);
      }
    }
    for (var i = 0; i < rows.length; i++) {
      //校验密码
      if (rows[i].doubleCheck == "true" || rows[i].doubleCheck == "1" || rows[i].doubleCheck) {
        if (rows[i].doubleCheckMan == undefined) {
          cb.utils.alert("第" + (i + 1) + "行未选择二次复核人", "error");
          return false;
        }
        promises.push(validatePassword(i, rows[i].doubleCheckMan, rows[i].checkerPassword).then(handerMessage));
      }
      if (checkNumObj[rows[i].sourcechild_id] != checkQualifiedNum[rows[i].sourcechild_id] + checkUnqualifiedNum[rows[i].sourcechild_id] + checkUncertainNum[rows[i].sourcechild_id]) {
        cb.utils.alert("第" + (i + 1) + "行;商品:" + rows[i].material_code + " 复核数量 不等于 {复核合格数量+复核不合格数量+复核不确定数量}", "error");
        return false;
      }
      if (rows[i].isBatchManage3 == 1 && (rows[i].batchNo == undefined || rows[i].batchNo == "")) {
        cb.utils.alert("第" + (i + 1) + "行;商品: " + rows[i].material_code + " 批次号不能为空", "error");
        return false;
      }
      let mapKey = rows[i].sourcechild_id + "|" + rows[i].item132yh;
      let lineHadNum = lineGroupCheckNumMap.get(mapKey) == undefined ? 0 : Number.parseFloat(lineGroupCheckNumMap.get(mapKey));
      lineGroupCheckNumMap.set(mapKey, lineHadNum + rows[i].checkNum);
    }
    //判断每行复核数量和初始数量
    for (let [key, value] of originCheckNumMap) {
      for (let [key1, value1] of lineGroupCheckNumMap) {
        if (key == key1 && value1 != value) {
          cb.utils.alert("商品:" + key1.split("|")[1] + " 拆行总复核数量 不等于 初始数量", "error");
          return false;
        }
      }
    }
    let sourceMId = viewModel.get("source_id").getValue();
    let checkTotleQty = {};
    promises.push(
      selPurinstockys(sourceMId).then((res) => {
        checkTotleQty = res;
      })
    );
    var promise = new cb.promise();
    Promise.all(promises).then(() => {
      let state = true;
      for (let i = 0; i < sourcechildIds.length; i++) {
        if (JSON.stringify(checkTotleQty) != "{}") {
          if (checkNumObj[sourcechildIds[i]] > checkTotleQty[sourcechildIds[i]]) {
            state = false;
          }
        }
      }
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        promise.reject();
      } else {
        promise.resolve();
      }
    });
    return promise;
  });
  //撤回判断，检查下游是否有单据
  viewModel.on("beforeUnsubmit", function (args) {
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.outStockLowerCheck", { lowerCode: viewModel.get("code").getValue() }, function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
        return false;
      }
      if (res.resultBool) {
        cb.utils.alert("撤回前需先删除下游不合格药品登记和质量复查记录", "error");
        return false;
      }
      returnPromise.resolve();
    });
    return returnPromise;
  });
  //删除判断，如果有下游单据，不允许删除
  viewModel.on("beforeDelete", function (args) {
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.outStockLowerCheck", { lowerCode: viewModel.get("code").getValue() }, function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
        return false;
      }
      if (res.resultBool) {
        cb.utils.alert("下游有不合格药品登记和质量复查记录，不能删除", "error");
        return false;
      }
      returnPromise.resolve();
    });
    return returnPromise;
  });
  function selPurinstockys(sourceMId) {
    return new Promise(function (resolve) {
      let message = "";
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.get_gjrkysChildInfo",
        {
          sourceMId: sourceMId,
          type: "销售出库复核"
        },
        function (err, res) {
          if (typeof res !== "undefined") {
            let checkTotleQty = res.checkTotleQty;
            resolve(checkTotleQty);
          } else if (err !== null) {
            message += err.message;
          }
        }
      );
    });
  }
  function getMaterialType(gsp_material_type) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getMaterialType",
        {
          materialType: gsp_material_type
        },
        function (err, res) {
          debugger;
          if (typeof res != "undefined") {
            resolve(res.parentRes);
          } else if (typeof err != "undefined") {
            cb.utils.alert(err.message, "error");
            reject(err.message);
          }
        }
      );
    });
  }
});