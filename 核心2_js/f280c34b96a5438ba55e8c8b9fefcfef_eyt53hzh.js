run = function (event) {
  var viewModel = this;
  //保存初始化时每行的复核数量
  var originCheckNumMap = new Map();
  viewModel.on("beforePush", function (args) {
    var gridModel = viewModel.getGridModel();
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
        cb.rest.invokeFunction(
          "GT22176AT10.publicFunction.checkChildOrderAudit",
          {
            id: id,
            uri: uri
          },
          function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              return false;
            }
            if (res.Info && res.Info.length > 0) {
              cb.utils.alert(res.Info, "error");
              return false;
            }
            cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.outOfRoomToNoGood", { id: id }, function (err, res) {
              if (res.resultNumb < 0) {
                cb.utils.alert("不合格数量有误", "error");
                return false;
              }
              returnPromise.resolve();
            });
          }
        );
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
    originCheckNumMap = new Map();
    viewModel.on("modeChange", function (data) {
      let recheckMan = viewModel.get("recheckMan").getValue();
      let recheckDept = viewModel.get("recheckDept").getValue();
      if ((data === "add" || data === "edit") && (recheckMan == "" || recheckMan == null)) {
        //获取当前用户对应的员工，赋值给复核人员
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("recheckMan").setValue(res.staffOfCurrentUser.id);
            viewModel.get("recheckMan_name").setValue(res.staffOfCurrentUser.name);
            if (recheckDept == "" || recheckDept == null) {
              viewModel.get("recheckDept").setValue(res.staffOfCurrentUser.deptId);
              viewModel.get("recheckDept_name").setValue(res.staffOfCurrentUser.deptName);
            }
          }
        });
      }
    });
    var rows = viewModel.getGridModel().getAllData();
    var gridModel = viewModel.getGridModel();
    for (let i = 0; i < rows.length; i++) {
      let key = rows[i].sourcechild_id + "|" + rows[i].item132yh;
      originCheckNumMap.set(key, (originCheckNumMap.get(key) == undefined ? 0 : originCheckNumMap.get(key)) + rows[i].checkNum);
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
      }
    }
    if (args.source_billtype != undefined && args.source_billtype == "ST.st_salesout") {
      gridModel.setColumnState("item135se_batchno", "visible", false);
      gridModel.setColumnState("location_name", "visible", false);
    }
  });
  viewModel.on("afterMount", function () {
    var gridModel = viewModel.getGridModel();
    gridModel.setColumnState("checkerPassword", "type", "password");
    //人员过滤
    viewModel.get("recheckMan_name").on("beforeBrowse", function () {
      // 获取组织id
      const value = viewModel.get("org_id").getValue();
      // 实现选择用户的组织id过滤
      let condition = {
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
    //密码字段初始化
    gridModel
      .getEditRowModel()
      .get("checkerPassword")
      .on("blur", function (a, b, c) {
        let value = gridModel.getCellValue(gridModel.getFocusedRowIndex(), "checkerPassword");
        gridModel.setCellValue(gridModel.getFocusedRowIndex(), "checkerPasswordHidden", value);
        gridModel.setCellValue(gridModel.getFocusedRowIndex(), "checkerPassword", "输入完成");
      });
    gridModel.on("rowColChange", function (args) {
      if (args.value.columnKey == "batchNo") {
        let data = {
          billtype: "VoucherList", // 单据类型
          billno: "9a579e14", // 单据号
          params: {
            mode: "browse" // (编辑态edit、新增态add、浏览态browse)
            //传参
          }
        };
        //打开一个单据，并在当前页面显示
        cb.loader.runCommandLine("bill", data, viewModel);
      }
    });
    //监听生产日期和有效期至变化，格式化
    gridModel.on("afterCellValueChange", function (data) {
      if (data.cellName == "item135se_batchno") {
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
        if (res.data.length > 0) {
          if (res.data[0].pass_ec == undefined || res.data[0].pass_ec != password) {
            message += "第" + (index + 1) + "行密码错误";
          }
        }
        resolve(message);
      });
    });
  };
  //保存前校验
  viewModel.on("beforeSave", function (args) {
    debugger;
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
    for (var i = 0; i < rows.length; i++) {
      let checkQualifiedNum = rows[i].checkQualifiedNum == undefined ? 0 : Number.parseFloat(rows[i].checkQualifiedNum);
      let checkUnqualifiedNum = rows[i].checkUnqualifiedNum == undefined ? 0 : Number.parseFloat(rows[i].checkUnqualifiedNum);
      let checkUncertainNum = rows[i].checkUncertainNum == undefined ? 0 : Number.parseFloat(rows[i].checkUncertainNum);
      //校验密码
      if (rows[i].doubleCheck == "true" || rows[i].doubleCheck == "1" || rows[i].doubleCheck) {
        if (rows[i].doubleCheckMan == undefined) {
          cb.utils.alert("第" + (i + 1) + "行未选择二次复核人", "error");
          return false;
        }
        promises.push(validatePassword(i, rows[i].doubleCheckMan, rows[i].checkerPasswordHidden).then(handerMessage));
      }
      if (rows[i].checkNum != checkQualifiedNum + checkUnqualifiedNum + checkUncertainNum) {
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
    var promise = new cb.promise();
    Promise.all(promises).then(() => {
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
      debugger;
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
};