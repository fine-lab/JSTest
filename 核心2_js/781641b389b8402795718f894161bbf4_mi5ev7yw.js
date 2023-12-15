run = function (event) {
  var viewModel = this;
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
          cb.utils.alert("GSP中api函数:GT22176AT10.backDefaultGroup.returnCheck4Sales报错:" + JSON.stringify(err), "error");
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
          if (err != undefined) {
            cb.utils.alert("GSP中api函数:GT22176AT10.backDefaultGroup.backRoomNoGood报错:" + JSON.stringify(err), "error");
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
  viewModel.on("afterLoadData", function (args) {
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
    debugger;
    var rows = viewModel.getGridModel().getAllData();
    var gridModel = viewModel.getGridModel();
    //初始化二次复核人和密码、隐藏密码字段
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].doubleCheck == "false" || rows[i].doubleCheck == "0" || !rows[i].doubleCheck) {
        gridModel.setCellValue(i, "password_display", "");
        gridModel.setCellValue(i, "password", "");
        gridModel.setCellState(i, "password_display", "readOnly", true);
        gridModel.setCellState(i, "password", "readOnly", true);
        gridModel.setCellValue(i, "doubleCheckMan_name", "");
        gridModel.setCellValue(i, "doubleCheckMan", "");
        gridModel.setCellState(i, "doubleCheckMan_name", "readOnly", true);
        gridModel.setCellState(i, "checkerPassword", "readOnly", true);
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
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "password", "输入完成");
    });
  gridModelInfo.on("afterCellValueChange", function (data) {
    if (data) {
      var curRowIndex = data.rowIndex;
      switch (data.cellName) {
        case "fcheckqty": {
          debugger;
          let oldvalue = parseFloat(gridModelInfo.getCellValue(curRowIndex, "fnotcheckqty"));
          var value = parseFloat(data.value);
          if (value > oldvalue) {
            cb.utils.alert("不允许大于未验收数量！", "error");
            gridModelInfo.setCellValue(curRowIndex, "fcheckqty", oldvalue);
            return;
          }
          break;
        }
      }
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
  viewModel.on("beforeSave", function () {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var rows = gridModelInfo.getRows();
    var rowLength = rows.length;
    var gridModel = viewModel.getGridModel();
    for (var i = 0; i < rowLength; i++) {
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
      //检验不合格数量
      let fcheckbhgqty = Number.parseFloat(currentRow.fcheckbhgqty);
      //检验拒收数量
      let fcheckjsqty = Number.parseFloat(currentRow.fcheckjsqty);
      //检验不确定数量
      let fcheckbqdqty = Number.parseFloat(currentRow.fcheckbqdqty);
      //是否二次复核
      if (fcheckqty == 0 && fcheckhgqty == 0 && fcheckbhgqty == 0 && fcheckjsqty == 0 && fcheckbqdqty == 0) {
        errorMsg += "第" + (i + 1) + "行数量全部为0,请确认！";
      }
      let sumqty = fcheckhgqty + fcheckbhgqty + fcheckjsqty + fcheckbqdqty;
      if (sumqty != fcheckqty) {
        errorMsg += "第" + (i + 1) + "行数据 检验合格数量+检验不合格数量+检验不确定数量+检验拒收数量!= 检验数量，请重新填写";
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
    var promise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        return false;
      } else {
        promise.resolve();
      }
    });
    return promise;
    //遍历密码数组生成json
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
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: value
    });
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
};