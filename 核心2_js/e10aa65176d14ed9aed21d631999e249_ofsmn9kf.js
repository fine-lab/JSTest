run = function (event) {
  var viewModel = this;
  var gridModelInfo = viewModel.get("SY01_gjtcfh_lList");
  let invokeFunction1 = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    proxy.doProxy(data, callback);
  };
  let getProLicInfo = function (isSku, materialId, orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { isSku: isSku, materialId: materialId, orgId: orgId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.proLicInfo);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  let getSwitchValue = function (value) {
    if (value == undefined || value == null || value == 0 || value == "0" || value == false || value == "false") {
      return 0;
    } else {
      return 1;
    }
  };
  let getProSkuLicInfo = function (materialId, sku, orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getProSkuLicInfo", { materialId: materialId, sku: sku, orgId: orgId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.proLicInfo);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  let updateViewModel = function (gridModelInfo, i, materialInfo) {
    if (materialInfo.doubleReview == 1 || materialInfo.doubleReview == "1" || materialInfo.doubleReview == true || materialInfo.doubleReview == "true") {
      gridModelInfo.setCellValue(i, "isdouble_check", materialInfo.doubleReview);
      gridModelInfo.setCellValue(i, "isdouble_check", materialInfo.doubleReview);
    } else {
      //如果不是二次验收的物料，那么二次验收人和密码不可以填写
      gridModelInfo.setCellState(i, "double_checker_name", "readOnly", true);
      gridModelInfo.setCellState(i, "doubleCheckPassword", "readOnly", true);
    }
    let isBatch = getSwitchValue(materialInfo.isBatchManage);
    let isValid = getSwitchValue(materialInfo.isExpiryDateManage);
    gridModelInfo.setCellValue(i, "isBatchManage", isBatch);
    gridModelInfo.setCellValue(i, "isExpiryDateManage", isValid);
    gridModelInfo.setCellValue(i, "expireDateNo", materialInfo.expireDateNo);
    gridModelInfo.setCellValue(i, "expireDateUnit", materialInfo.expireDateUnit);
    //如果不是批次管理，批次不可填写
    if (isBatch == 0) {
      gridModelInfo.setCellState(i, "item139ld_batchno", "readOnly", true);
      gridModelInfo.setCellState(i, "batch_no", "readOnly", true);
    }
  };
  let parseDate = function (date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
  };
  viewModel.on("modeChange", function (data) {
    if (data == "add") {
      viewModel.get("reviewdate").setValue(parseDate(new Date()));
      //获取当前用户对应的部门员工，赋值给复核人员
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
        if (res != undefined && res.staffOfCurrentUser != undefined) {
          viewModel.get("checker").setValue(res.staffOfCurrentUser.id);
          viewModel.get("checker_name").setValue(res.staffOfCurrentUser.name);
          viewModel.get("checkdep").setValue(res.staffOfCurrentUser.deptId);
          viewModel.get("checkdep_name").setValue(res.staffOfCurrentUser.deptName);
        }
      });
      let rows = gridModelInfo.getRows();
      for (let i = 0; i < rows.length; i++) {
        let org_id = gridModelInfo.getCellValue(i, "inInvoiceOrg");
        getProLicInfo(false, rows[i].material, org_id).then((materialInfo) => {
          if (materialInfo == null || materialInfo == undefined) {
            getProSkuLicInfo(rows[i].material, rows[i].sku, org_id).then((materialInfo) => {
              updateViewModel(gridModelInfo, i, materialInfo);
            });
          } else {
            updateViewModel(gridModelInfo, i, materialInfo);
          }
        });
      }
    } else if (data == "edit") {
    }
  });
  gridModelInfo.on("afterMount", function () {
    gridModelInfo.setColumnState("doubleCheckPassword", "type", "password");
  });
  viewModel.on("afterLoadData", function () {
    let currentState = viewModel.getParams().mode;
    if (currentState != "edit") {
      return;
    }
    let rows = gridModelInfo.getRows();
    for (let i = 0; i < rows.length; i++) {
      let isdouble_check = rows[i].isdouble_check;
      if (!(isdouble_check == 1 || isdouble_check == "1" || isdouble_check == true || isdouble_check == "true")) {
        //如果不是二次验收的物料，那么二次验收人和密码不可以填写
        gridModelInfo.setCellState(i, "double_checker_name", "readOnly", true);
        gridModelInfo.setCellState(i, "doubleCheckPassword", "readOnly", true);
      }
    }
  });
  //必须blur，不然不触发值更新
  gridModelInfo
    .getEditRowModel()
    .get("doubleCheckPassword")
    .on("blur", function () {
      let value = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "doubleCheckPassword");
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "doubleCheckPasswordDisable", value);
      let str = "";
      for (let i = 0; i < value.length; i++) {
        str += "●";
      }
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "doubleCheckPassword", str);
    });
  gridModelInfo
    .getEditRowModel()
    .get("doubleCheckPassword")
    .on("focus", function () {
      let value = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "doubleCheckPasswordDisable");
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "doubleCheckPassword", value);
    });
  //退货供应商过滤
  viewModel.get("returnsupplier_name").on("beforeBrowse", function () {
    let org_id = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "vendorApplyRange.org",
      op: "eq",
      value1: org_id
    });
    this.setFilter(condition);
  });
  //复核员过滤
  viewModel.get("checker_name").on("beforeBrowse", function (data) {
    let dep_id = viewModel.get("checkdep").getValue();
    if (dep_id == undefined) {
      cb.utils.alert("请先选择部门");
      return false;
    }
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.dept_id",
      op: "eq",
      value1: dep_id
    });
    this.setFilter(condition);
  });
  gridModelInfo
    .getEditRowModel()
    .get("sku_code")
    .on("beforeBrowse", function () {
      let material = gridModelInfo.getEditRowModel().get("material").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "productId",
        op: "eq",
        value1: material
      });
      this.setFilter(condition);
    });
  gridModelInfo
    .getEditRowModel()
    .get("item139ld_batchno")
    .on("beforeBrowse", function () {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "product",
        op: "eq",
        value1: gridModelInfo.getEditRowModel().get("material").getValue()
      });
      this.setFilter(condition);
    });
  //二次验收人过滤，按照组织
  gridModelInfo
    .getEditRowModel()
    .get("double_checker_name")
    .on("beforeBrowse", function (data) {
      let org_id = gridModelInfo.getEditRowModel().get("inInvoiceOrg").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "org_id",
        op: "eq",
        value1: org_id
      });
      this.setFilter(condition);
    });
  //子表，仓库过滤
  gridModelInfo
    .getEditRowModel()
    .get("warehouse_name")
    .on("beforeBrowse", function (data) {
      let org_id = viewModel.get("org_id").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      //是否gsp物料
      condition.simpleVOs.push({
        field: "org",
        op: "eq",
        value1: org_id
      });
      this.setFilter(condition);
    });
  //子表，货位过滤
  gridModelInfo
    .getEditRowModel()
    .get("position_name")
    .on("beforeBrowse", function (data) {
      let warehouse_id = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "warehouse");
      if (warehouse_id == undefined) {
        cb.utils.alert("请先选择仓库");
        return false;
      }
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      //是否gsp物料
      condition.simpleVOs.push({
        field: "warehouseId",
        op: "eq",
        value1: warehouse_id
      });
      this.setFilter(condition);
    });
  //复核部门切换，复核员清空
  viewModel.get("checkdep_name").on("afterValueChange", function (data) {
    if (data.value == undefined || (data.oldValue != undefined && data.value.id != data.oldValue.id)) {
      viewModel.get("checker").setValue(null);
      viewModel.get("checker_name").setValue(null);
    }
  });
  gridModelInfo.on("afterCellValueChange", function (data) {
    if (data.cellName == "item139ld_batchno") {
      gridModelInfo.setCellValue(data.rowIndex, "manufact_date", parseDate(data.value.producedate));
      gridModelInfo.setCellValue(data.rowIndex, "valid_until", parseDate(data.value.invaliddate));
    }
  });
  viewModel.on("beforeSave", function () {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    let qtyInfo = {};
    for (var i = 0; i < gridModelInfo.getRows().length; i++) {
      //源单分录id
      let sourceEntryId = gridModelInfo.getCellValue(i, "sourcechild_id");
      if (!qtyInfo.hasOwnProperty(sourceEntryId)) {
        qtyInfo[sourceEntryId] = {};
        qtyInfo[sourceEntryId]["index"] = [];
        qtyInfo[sourceEntryId]["qualifie_qty"] = 0;
        qtyInfo[sourceEntryId]["unqualifie_qty"] = 0;
        qtyInfo[sourceEntryId]["uncertain_qty"] = 0;
      }
      qtyInfo[sourceEntryId]["index"].push(i);
      if (parseFloat(gridModelInfo.getCellValue(i, "checkQty")) != 0) {
        qtyInfo[sourceEntryId]["checkQty"] = parseFloat(gridModelInfo.getCellValue(i, "checkQty"));
      }
      //复核合格数量
      let qualifie_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "qualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "qualifie_qty"));
      //复核不合格数量
      let unqualifie_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "unqualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "unqualifie_qty"));
      //复核不确定数量
      let uncertain_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"));
      qtyInfo[sourceEntryId]["qualifie_qty"] += qualifie_qty;
      qtyInfo[sourceEntryId]["unqualifie_qty"] += unqualifie_qty;
      qtyInfo[sourceEntryId]["uncertain_qty"] += uncertain_qty;
      //是否二次复核
    }
    //判断检验数量是否一致
    for (let key in qtyInfo) {
      if (qtyInfo[key]["qualifie_qty"] + qtyInfo[key]["unqualifie_qty"] + qtyInfo[key]["uncertain_qty"] != qtyInfo[key]["checkQty"]) {
        errorMsg += qtyInfo[key]["index"].toString() + "行分录,检验合格数量 + 检验不合格数量 + 检验不确定数量 != 检验数量,请重新填写\n";
      }
    }
    if (errorMsg.length > 0) {
      cb.utils.alert(errorMsg, "error");
      return false;
    }
    let orgId = viewModel.get("resourceOrg").getValue();
    let passwordsJson = [];
    getGspParams(orgId).then((res) => {
      if (res.gspParameterArray[0].isgspmanage != undefined && res.gspParameterArray[0].isgspmanage != 0 && res.gspParameterArray[0].isgspmanage != "0") {
        for (let i = 0; i < gridModelInfo.getRows().length; i++) {
          let isdouble_check = gridModelInfo.getCellValue(i, "isdouble_check");
          if (isdouble_check == 1 || isdouble_check == "1" || isdouble_check == true || isdouble_check == "true") {
            let double_checker = gridModelInfo.getCellValue(i, "double_checker");
            let checker_password_display = gridModelInfo.getCellValue(i, "doubleCheckPasswordDisable");
            if (
              double_checker == undefined ||
              double_checker == "" ||
              double_checker == null ||
              checker_password_display == "" ||
              checker_password_display == undefined ||
              checker_password_display == null
            ) {
              errorMsg += "第" + (i + 1) + "行物料需要双人复核,请填写二次验收人和密码\n"; //+检验不合格数量
            } else {
              passwordsJson.push({
                index: i + 1,
                doubleCheck: double_checker,
                password: checker_password_display
              });
            }
          }
        }
        promises.push(validatePassword(passwordsJson).then(handerMessage));
      }
    });
    promises.push(validateSourceQty(gridModelInfo).then(handerMessage));
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
    //遍历密码数组生成json
  });
  viewModel.on("beforePush", function (data) {
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    if (viewModel.get("verifystate").getValue() != 2) {
      errorMsg += "单据未审核,无法下推";
      cb.utils.alert(errorMsg);
      return false;
    }
    if (data.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let request = { id: viewModel.get("id").getValue(), uri: "GT22176AT10.GT22176AT10.Sy01_quareview" };
      promises.push(validateLowerState(apiUrl, request).then(handerMessage));
      let pushFlag = false;
      for (let i = 0; i < gridModelInfo.getRows().length; i++) {
        let uncertain_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"));
        let review_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "review_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "review_qty"));
        if (uncertain_qty - review_qty > 0) {
          pushFlag = true;
        }
      }
      if (!pushFlag) {
        errorMsg += "无可复查数量\n";
      }
      var returnPromise = new cb.promise();
      Promise.all(promises).then(() => {
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      });
      return returnPromise;
    } else if (data.params.cSvcUrl.indexOf("targetBillNo=a099fc40") > 0) {
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let request = { id: viewModel.get("id").getValue(), uri: "GT22176AT10.GT22176AT10.SY01_bad_drugv7" };
      promises.push(validateLowerState(apiUrl, request).then(handerMessage));
      let pushFlag = false;
      for (let i = 0; i < gridModelInfo.getRows().length; i++) {
        let unqualifie_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "unqualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "unqualifie_qty"));
        let review_unqualifie_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "review_unqualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "review_unqualifie_qty"));
        let unqualifie_register = isNaN(parseFloat(gridModelInfo.getCellValue(i, "unqualifie_register"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "unqualifie_register"));
        if (unqualifie_qty + review_unqualifie_qty - unqualifie_register > 0) {
          pushFlag = true;
        }
      }
      if (!pushFlag) {
        errorMsg += "无可不合格登记数量\n";
      }
      var returnPromise = new cb.promise();
      Promise.all(promises).then(() => {
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      });
      return returnPromise;
    }
  });
  function validateLowerState(apiUrl, request) {
    return new Promise(function (resolve) {
      invokeFunction1(
        apiUrl,
        request,
        function (err, res) {
          //数量
          let message = "";
          if (typeof res.Info != "undefined") {
            message = res.Info;
          }
          resolve(message);
        },
        { domainKey: "sy01" }
      );
    });
  }
  let validateSourceQty = function (gridModelInfo) {
    return new Promise(function (resolve) {
      let message = "";
      let request = {};
      let param = {};
      param.type = "GET";
      if (window.location.href.indexOf("dbox") > -1) {
        param.url = "https://www.example.com/" + gridModelInfo.getCellValue(0, "source_id");
      } else {
        param.url = "https://www.example.com/" + gridModelInfo.getCellValue(0, "source_id");
      }
      param.domainID = "yourIDHere";
      request.json = null;
      request.params = param;
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.openLink", request, function (err, res) {
        if (typeof res !== "undefined") {
          let purOrderInfo = JSON.parse(res.apiResponse).data;
          for (let i = 0; i < gridModelInfo.getRows().length; i++) {
            for (let j = 0; j < purOrderInfo.purchaseOrders.length; j++) {
              if (gridModelInfo.getCellValue(i, "sourcechild_id") == purOrderInfo.purchaseOrders[j].id) {
                if (gridModelInfo.getCellValue(i, "checkQty") > -purOrderInfo.purchaseOrders[j].qty - purOrderInfo.purchaseOrders[j].extend_review_qty) {
                  message += "第" + (i + 1) + "检验数量不能 > 采购订单.数量-采购订单.累计复核数量\n";
                }
                continue;
              }
            }
          }
        } else if (err !== null) {
          message += "采购订单接口查询接口报错\n";
        }
        resolve(message);
      });
    });
  };
  let validatePassword = function (passwordJson) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.validatePassword", { passwordJson: passwordJson }, function (err, res) {
        if (typeof res !== "undefined") {
          resolve(res.errorMsg);
        } else if (err !== null) {
          resolve("密码查询接口报错,validatePassword");
        }
      });
    });
  };
  let getGspParams = function (orgId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getGspParameters",
        {
          saleorgid: orgId
        },
        function (err, res) {
          if (res !== undefined) {
            resolve(res);
          } else if (err !== null) {
            resolve(err.message);
          }
        }
      );
    });
  };
};