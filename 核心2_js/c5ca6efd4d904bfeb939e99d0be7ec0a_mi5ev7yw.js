viewModel.on("customInit", function (data) {
  var gridModelInfo = viewModel.getGridModel("sy01_gspsalereturnsList");
  gridModelInfo.setShowCheckbox(false); //使表体行可以勾选
  // 质量复查单推单校验
  viewModel.on("beforePush", function (args) {
    var gridModel = viewModel.getGridModel();
    var returnPromise = new cb.promise();
    // 代码判断 质量复查单推单
    if (args.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      // 获取退回检验单的ID
      var thisRtnid = viewModel.get("id").getValue();
      var rtnCode = viewModel.get("code").getValue();
      // 调用校验API函数
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.validReturnToCheck", { returnId: thisRtnid, returnCode: rtnCode }, function (err, res) {
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
      // 判断单据类型
    } else if (args.params.cSvcUrl.indexOf("targetBillNo=3837a6e9") > 0) {
      var id = viewModel.get("id").getValue();
      var bhgcode = viewModel.get("code").getValue();
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.returnCheck4Sales", { id: id, code: bhgcode, thisuri: "GT22176AT10.GT22176AT10.SY01_bad_drugv7" }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        }
        if (res.errInfo.length > 0 && res.errInfo) {
          cb.utils.alert(res.errInfo, "error");
          return false;
        }
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.backRoomNoGood", { id: id }, function (err, res) {
          if (res.resultNumb < 0) {
            cb.utils.alert("不合格数量有误", "error");
            return false;
          }
          returnPromise.resolve();
        });
      });
    } else if (args.params.cSvcUrl.indexOf("targetBillNo=6a247d71") > 0) {
      var id = viewModel.get("id").getValue();
      var jsdcode = viewModel.get("code").getValue();
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.returnCheck4Sales", { id: id, code: jsdcode, thisuri: "GT22176AT10.GT22176AT10.SY01_medcrefusev2" }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        }
        if (res.errInfo.length > 0 && res.errInfo) {
          cb.utils.alert(res.errInfo, "error");
          return false;
        }
        returnPromise.resolve();
      });
      returnPromise.resolve();
    } else {
      // 非特殊处理单据类型直接回调
      returnPromise.resolve();
    }
    // 返回
    return returnPromise;
  });
  viewModel.get("button50gi").on("click", function (data) {
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
  viewModel.get("button70qi").on("click", function (data) {
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
  viewModel.on("modeChange", function (data) {
    let corpContact = viewModel.get("corpContact").getValue();
    let saleDepartmentId = viewModel.get("saleDepartmentId").getValue();
    if ((data === "add" || data === "edit") && (corpContact == "" || corpContact == null)) {
      //获取当前用户对应的员工，赋值给复核人员
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
        if (res != undefined && res.staffOfCurrentUser != undefined) {
          viewModel.get("corpContact").setValue(res.staffOfCurrentUser.id);
          viewModel.get("corpContact_name").setValue(res.staffOfCurrentUser.name);
          if (saleDepartmentId == "" || saleDepartmentId == null) {
            viewModel.get("saleDepartmentId").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("saleDepartmentId_name").setValue(res.staffOfCurrentUser.deptName);
          }
        }
      });
    }
  });
  viewModel.on("afterLoadData", function (args) {
    var mode = viewModel.getParams().mode;
    let rows = viewModel.getGridModel().getRows();
    let verifystate = viewModel.get("verifystate").getValue();
    if (verifystate == 1) {
      viewModel.get("dropdownbutton22ta").setVisible(false);
    } else {
      viewModel.get("dropdownbutton22ta").setVisible(true);
    }
    if (verifystate == 2) {
      viewModel.get("button70qi").setVisible(true);
      viewModel.get("button50gi").setVisible(false);
    } else {
      if (verifystate == 0) {
        viewModel.get("button70qi").setVisible(false);
        viewModel.get("button50gi").setVisible(true);
      }
    }
    if (mode == "add" || mode == "edit") {
      let saleorgid = viewModel.get("settlementOrgId").getValue();
      if (saleorgid == undefined) {
        saleorgid = viewModel.get("org_id").getValue();
      }
      for (var i = 0; i < rows.length; i++) {
        let id = rows[i].productId;
        SetProductInfo(id, saleorgid, i);
      }
    }
    //初始化二次复核人和密码、隐藏密码字段
    for (var i = 0; i < rows.length; i++) {
      //设置默认库存状态
      if (mode == "add") {
        setStockStatehg(null, "合格", 2, i);
        setStockStatebhg(null, "不合格", 2, i);
      }
    }
    //查询出批号的id
    if (mode == "add") {
      for (let i = 0; i < rows.length; i++) {
        let productId = rows[i].productId;
        let batchNo = rows[i].batchNo;
        getGSPBatchnoID(productId, batchNo).then((batchnoRes) => {
          if (batchnoRes.length > 0) {
            gridModelInfo.setCellValue(i, "batchnoref", batchnoRes[0].id);
            gridModelInfo.setCellValue(i, "batchnoref_batchno", batchNo);
          }
        });
      }
      let orgId = args.org_id;
      let agentId = args.agentId;
      if (typeof agentId != null && agentId != null) {
        getGSPCustomFiles(orgId, agentId).then((customRes) => {
          debugger;
          if (customRes.length > 0) {
            viewModel.get("shippingLocation").setValue(customRes[0].warehouseAddress);
          }
        });
      }
    }
  });
  gridModelInfo.on("rowColChange", function (args) {
    var rowIndex = args.value.rowIndex;
    var columnKey = args.value.columnKey;
    if (columnKey == "batchNo" || columnKey == "item153ce_batchno") {
      var canbEdit = gridModelInfo.getCellValue(rowIndex, "bisBatchManage");
      if (canbEdit == true || canbEdit == "1") {
        //如果是批次管理，需要进一步判断批次号是否为空，批次号为空才允许编辑
        var currentRow = gridModelInfo.getRow(args.value.rowIndex);
        if (currentRow.batchNo == null && currentRow.batchNo == undefined) {
          return true;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  });
  gridModelInfo.on("afterMount", function () {
    gridModelInfo.setColumnState("password", "type", "password");
  });
  gridModelInfo
    .getEditRowModel()
    .get("password")
    .on("blur", function () {
      let value = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "password");
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "password_display", value);
      let str = "";
      for (let i = 0; i < value.length; i++) {
        str += "●";
      }
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "password", str);
    });
  gridModelInfo
    .getEditRowModel()
    .get("password")
    .on("focus", function () {
      let value = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "password_display");
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "password", value);
    });
  //复制行时，检验数量不复制
  gridModelInfo.on("afterInsertRow", function (data) {
    gridModelInfo.setCellValue(data.index, "fcheckqty", 0);
  });
  gridModelInfo.on("afterCellValueChange", function (data) {
    debugger;
    if (data) {
      var curRowIndex = data.rowIndex;
      switch (data.cellName) {
        case "fcheckqty": {
          debugger;
          let oldvalue = parseFloat(gridModelInfo.getCellValue(curRowIndex, "fnotcheckqty"));
          var value = parseFloat(data.value);
          if (value > oldvalue) {
            cb.utils.alert("不允许大于未验收数量！", "error");
            gridModelInfo.setCellValue(curRowIndex, "sampleQuantity", oldvalue);
            gridModelInfo.setCellValue(curRowIndex, "fcheckqty", oldvalue);
            return;
          } else {
            gridModelInfo.setCellValue(curRowIndex, "sampleQuantity", value);
          }
          break;
        }
        case "item153ce_batchno": {
          var dtminvalidDate = data.value.invaliddate;
          if (null != dtminvalidDate && undefined != dtminvalidDate) {
            var dtmInvalidDate = getLocalTime(dtminvalidDate);
            gridModelInfo.setCellValue(curRowIndex, "dtminvalidDate", dtmInvalidDate);
          } else {
            gridModelInfo.setCellValue(curRowIndex, "dtminvalidDate", null);
          }
          var dtmproducedate = data.value.producedate;
          if (null != dtmproducedate && undefined != dtmproducedate) {
            var dtmProductDate = getLocalTime(dtmproducedate);
            gridModelInfo.setCellValue(curRowIndex, "productDate", dtmProductDate);
          } else {
            gridModelInfo.setCellValue(curRowIndex, "productDate", null);
          }
          break;
        }
      }
    }
  });
  viewModel.get("saleDepartmentId_name").on("beforeBrowse", function (data) {
    var externalData = {};
    externalData.ref_parentorgid = viewModel.get("org_id").getValue();
    (externalData.funcCode = "all"), (externalData.accountdelegate = "true"), viewModel.get("saleDepartmentId_name").setState("externalData", externalData);
  });
  viewModel.get("saleDepartmentId_name").on("afterValueChange", function (data) {
    if (data.value == null || (data.oldValue != null && data.value.id != data.oldValue.id)) {
      viewModel.get("corpContact").setValue(null);
      viewModel.get("corpContact_name").setValue(null);
    }
  });
  gridModelInfo.on("beforeBrowse", function (args) {
    if (args) {
      let cellname = args.cellName;
      let rowIndex = args.rowIndex;
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      if (cellname == "warehouse_name") {
        let orgid = viewModel.get("org_id").getValue();
        if (null == orgid || undefined == orgid) {
          cb.utils.alert("请录入组织!", "warning");
          return false;
        }
        condition.simpleVOs.push({
          field: "org",
          op: "eq",
          value1: orgid
        });
        args.context.setFilter(condition);
      }
      if (cellname == "location_name") {
        let warehouse = gridModelInfo.getCellValue(rowIndex, "warehouse");
        if (null == warehouse || undefined == warehouse) {
          cb.utils.alert("请录入仓库后选择货位!", "warning");
          return false;
        }
        condition.simpleVOs.push({
          field: "warehouseId",
          op: "eq",
          value1: warehouse
        });
        args.context.setFilter(condition);
      }
    }
  });
  let printArray = function (arr) {
    if (arr.length == 1) {
      return "第" + (arr[0] + 1) + "行";
    }
    let message = "复制行,第";
    for (let i = 0; i < arr.length; i++) {
      if (i == arr.length - 1) {
        message += arr[i] + 1 + "行";
      } else {
        message += arr[i] + 1 + ",";
      }
    }
    return message;
  };
  viewModel.on("beforeSave", function () {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var rows = gridModelInfo.getRows();
    var rowLength = rows.length;
    var gridModel = viewModel.getGridModel();
    //先计算数量是否填写正确
    let qtyInfo = {};
    let sourceChildId = [];
    for (let i = 0; i < rowLength; i++) {
      let sourceEntryId = gridModelInfo.getCellValue(i, "sourcechild_id");
      if (!qtyInfo.hasOwnProperty(sourceEntryId)) {
        sourceChildId.push(sourceEntryId);
        qtyInfo[sourceEntryId] = {};
        qtyInfo[sourceEntryId]["index"] = [];
        qtyInfo[sourceEntryId]["fcheckqty"] = 0; //待检验数量
        qtyInfo[sourceEntryId]["fcheckhgqty"] = 0; //验收合格数量
        qtyInfo[sourceEntryId]["fcheckbhgqty"] = 0; //验收不合格数量
        qtyInfo[sourceEntryId]["fcheckjsqty"] = 0; //验收拒收数量
        qtyInfo[sourceEntryId]["fcheckbqdqty"] = 0; //验收不确定数量
      }
      qtyInfo[sourceEntryId]["index"].push(i);
      if (parseFloat(gridModelInfo.getCellValue(i, "fcheckqty")) != 0) {
        qtyInfo[sourceEntryId]["fcheckqty"] += isNaN(parseFloat(gridModelInfo.getCellValue(i, "fcheckqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "fcheckqty"));
        //验收不合格数量
      }
      //验收合格数量
      qtyInfo[sourceEntryId]["fcheckhgqty"] += isNaN(parseFloat(gridModelInfo.getCellValue(i, "fcheckhgqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "fcheckhgqty"));
      //验收不合格数量
      qtyInfo[sourceEntryId]["fcheckbhgqty"] += isNaN(parseFloat(gridModelInfo.getCellValue(i, "fcheckbhgqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "fcheckbhgqty"));
      //验收拒收数量
      qtyInfo[sourceEntryId]["fcheckjsqty"] += isNaN(parseFloat(gridModelInfo.getCellValue(i, "fcheckjsqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "fcheckjsqty"));
      //验收不确定数量
      qtyInfo[sourceEntryId]["fcheckbqdqty"] += isNaN(parseFloat(gridModelInfo.getCellValue(i, "fcheckbqdqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "fcheckbqdqty"));
    }
    for (let key in qtyInfo) {
      if (qtyInfo[key]["fcheckhgqty"] + qtyInfo[key]["fcheckbhgqty"] + qtyInfo[key]["fcheckjsqty"] + qtyInfo[key]["fcheckbqdqty"] != qtyInfo[key]["fcheckqty"]) {
        errorMsg += printArray(qtyInfo[key]["index"]) + ",检验合格数量 + 检验不合格数量 + 检验拒收数量 + 检验不确定数量 != 检验数量,请重新填写\n";
      }
    }
    if (errorMsg.length > 0) {
      cb.utils.alert(errorMsg, "error");
      return false;
    }
    for (let i = 0; i < rowLength; i++) {
      var currentRow = rows[i];
      var productDate = currentRow.productDate;
      var dtminvalidDate = currentRow.dtminvalidDate;
      if (null != productDate && undefined != productDate) {
        var dtmProductDate = getLocalTime(productDate);
        gridModel.setCellValue(i, "productDate", dtmProductDate);
      }
      if (null != dtminvalidDate && undefined != dtminvalidDate) {
        var dtmInvalidDate = getLocalTime(dtminvalidDate);
        gridModel.setCellValue(i, "dtminvalidDate", dtmInvalidDate);
      }
      if (Number.parseFloat(currentRow.fnotcheckqty) == 0) continue;
      //检验数量
      let fcheckqty = Number.parseFloat(currentRow.fcheckqty);
      //检验合格数量
      let fcheckhgqty = Number.parseFloat(currentRow.fcheckhgqty);
      let qualifiedstate = currentRow.qualifiedstate;
      if (fcheckhgqty > 0 && qualifiedstate == undefined) {
        errorMsg += "第" + (i + 1) + "行合格数量大于0,必须录入合格库存状态！";
      }
      //检验不合格数量
      let fcheckbhgqty = Number.parseFloat(currentRow.fcheckbhgqty);
      let noqualifiedstate = currentRow.noqualifiedstate;
      if (fcheckbhgqty > 0 && noqualifiedstate == undefined) {
        errorMsg += "第" + (i + 1) + "行不合格数量大于0,必须录入不合格库存状态！";
      }
      //是否二次复核
      if (fcheckqty == 0 && fcheckhgqty == 0 && fcheckbhgqty == 0 && fcheckjsqty == 0 && fcheckbqdqty == 0) {
        errorMsg += "第" + (i + 1) + "行数量全部为0,请确认！";
      }
      let isDoubleCheck = gridModelInfo.getCellValue(i, "doubleCheck");
      if (isDoubleCheck == 1 || isDoubleCheck == "true" || isDoubleCheck == true) {
        let doubleCheckMan = gridModelInfo.getCellValue(i, "doubleCheckMan");
        if (doubleCheckMan == undefined) {
          errorMsg += "第" + (i + 1) + "行未选择二次验收人！";
        }
        promises.push(validatePassword(i, gridModelInfo.getCellValue(i, "doubleCheckMan"), gridModelInfo.getCellValue(i, "password_display")).then(handerMessage));
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
      if (viewModel.getParams().mode == "add") {
        for (let i = 0; i < sourceChildId.length; i++) {
          if (JSON.stringify(checkTotleQty) != "{}") {
            if (qtyInfo[sourceChildId[i]].fcheckqty > checkTotleQty[sourceChildId[i]]) {
              state = false;
            }
          }
        }
        if (!state) {
          cb.utils.alert("剩余到货数量小于验收数量，请检查", "error");
          promise.reject();
        }
      }
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        return false;
      } else {
        promise.resolve();
      }
    });
    return promise;
  });
  function validatePassword(index, id, password) {
    return new Promise(function (resolve) {
      let querySql = "select pass_ec from GT22176AT10.GT22176AT10.SY01_secondaccepter where id ='" + id + "'";
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.queryBySql", { sql: querySql }, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          for (let i = 0, len = res.data.length; i < len; i++) {
            if (!(typeof res.data[0].pass_ec != "undefined" && typeof password != "undefined" && res.data[0].pass_ec == password)) message += "第" + (index + 1) + "行二次验收人密码错误！";
          }
        } else if (err !== null) {
          message += "密码查询接口报错";
        }
        resolve(message);
      });
    });
  }
  viewModel.get("corpContact_name").on("beforeBrowse", function () {
    // 获取组织id
    const value = viewModel.get("org_id").getValue();
    let dep_id = viewModel.get("saleDepartmentId").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
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
  function getLocalTime(longTypeDate) {
    if (isNaN(longTypeDate) && !isNaN(Date.parse(longTypeDate))) {
      return longTypeDate;
    }
    var dateType = "";
    var date = new Date();
    date.setTime(longTypeDate);
    dateType = date.getFullYear() + "-" + getMonth(date) + "-" + getDay(date); //yyyy-MM-dd格式日期
    return dateType;
  }
  function getMonth(date) {
    var month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if (month < 10) {
      month = "0" + month;
    }
    return month;
  }
  function getDay(date) {
    var day = "";
    day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return day;
  }
  function setStockStatehg(id, name, type, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("ST.backDefaultGroup.querystockstateinfo", { id: id, name: name, type: type }, function (err, res) {
        if (res.info.id) {
          gridModelInfo.setCellValue(rowIndex, "qualifiedstate", res.info.id);
          gridModelInfo.setCellValue(rowIndex, "qualifiedstate_name", res.info.name);
        }
      });
    });
  }
  function setStockStatebhg(id, name, type, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("ST.backDefaultGroup.querystockstateinfo", { id: id, name: name, type: type }, function (err, res) {
        if (res.info.id) {
          gridModelInfo.setCellValue(rowIndex, "noqualifiedstate", res.info.id);
          gridModelInfo.setCellValue(rowIndex, "noqualifiedstate_name", res.info.name);
        }
      });
    });
  }
  let batchAudit = function (ids, userid, tenantid) {
    return new Promise(function (resolve) {
      var queryProxy = cb.rest.DynamicProxy.create({
        settle: {
          url: "/gsp/batchAuditSaleReturn",
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
  let batchUnAudit = function (ids, userid, tenantid) {
    return new Promise(function (resolve) {
      var queryProxy = cb.rest.DynamicProxy.create({
        settle: {
          url: "/gsp/batchUnAuditSaleReturn",
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
  let SetProductInfo = function (materialId, orgid, i) {
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { materialId: materialId, orgId: orgid }, function (err, res) {
      if (typeof res !== "undefined") {
        if (res.proLicInfo) {
          //是否二次验收
          if (res.proLicInfo.doubleReview) {
            var gridModel = viewModel.getGridModel();
            gridModel.setCellValue(i, "doubleCheck", res.proLicInfo.doubleReview);
            if (res.proLicInfo.doubleReview == "false" || res.proLicInfo.doubleReview == "0" || !res.proLicInfo.doubleReview) {
              gridModel.setCellValue(i, "password_display", "");
              gridModel.setCellValue(i, "password", "");
              gridModel.setCellState(i, "password_display", "readOnly", true);
              gridModel.setCellState(i, "password", "readOnly", true);
              gridModel.setCellValue(i, "doubleCheckMan_name", "");
              gridModel.setCellValue(i, "doubleCheckMan", "");
              gridModel.setCellState(i, "doubleCheckMan_name", "readOnly", true);
              gridModel.setCellState(i, "checkerPassword", "readOnly", true);
            }
            if (["1", 1, "true", true].includes(res.proLicInfo.doubleReview)) {
              viewModel.get("isDoubleCheck").setValue(1);
            }
          }
        }
        returnPromise.resolve();
      } else if (err !== null) {
        cb.utils.alert(err.message);
      }
    });
    return returnPromise;
  };
  function selPurinstockys(sourceMId) {
    return new Promise(function (resolve) {
      let message = "";
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.get_gjrkysChildInfo",
        {
          sourceMId: sourceMId,
          type: "销售退回验收"
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
  let getGSPBatchnoID = function (product, batchno) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getGSPBatchnoID",
        {
          product: product,
          batchno: batchno
        },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            reject(err.message);
          } else {
            resolve(res.batchnoRes);
          }
        }
      );
    });
  };
  function getGSPCustomFiles(orgId, agentId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction(
        "GT22176AT10.gspofsales.getGSPCustomFile",
        {
          orgId: orgId,
          customId: agentId
        },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            reject(err.message);
          } else {
            resolve(res.customRes);
          }
        }
      );
    });
  }
});