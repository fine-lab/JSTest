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
  };
  viewModel.on("modeChange", function (data) {
    if (data == "add" || data == "edit") {
      viewModel.get("reviewdate").setValue(gjtcfh_parseDate(new Date()));
      //获取当前用户对应的部门员工，赋值给复核人员
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
        if (res != undefined && res.staffOfCurrentUser != undefined) {
          viewModel.get("checker").setValue(res.staffOfCurrentUser.id);
          viewModel.get("checker_name").setValue(res.staffOfCurrentUser.name);
          viewModel.get("checkdep").setValue(res.staffOfCurrentUser.deptId);
          viewModel.get("checkdep_name").setValue(res.staffOfCurrentUser.deptName);
        }
      });
      let org_id = viewModel.get("org_id").getValue();
      let rows = gridModelInfo.getRows();
      for (let i = 0; i < rows.length; i++) {
        gjtcfh_getCustomerInfo(rows[i].material, org_id).then((materialInfo) => {
          if (materialInfo.extend_srfh == 1 || materialInfo.extend_srfh == "1" || materialInfo.extend_srfh == true || materialInfo.extend_srfh == "true") {
            gridModelInfo.setCellValue(i, "isdouble_check", materialInfo.extend_srfh);
            gridModelInfo.setCellValue(i, "isdouble_check", materialInfo.extend_srfh);
          } else {
            //如果不是二次验收的物料，那么二次验收人和密码不可以填写
            gridModelInfo.setCellState(i, "double_checker_name", "readOnly", true);
            gridModelInfo.setCellState(i, "doubleCheckPassword", "readOnly", true);
          }
          getProLicInfo(false, rows[i].material, org_id).then((materialInfo) => {
            if (materialInfo == null || materialInfo == undefined) {
              getProSkuLicInfo(rows[i].material, rows[i].sku, org_id).then((materialInfo) => {
                updateViewModel(gridModelInfo, i, materialInfo);
              });
            } else {
              updateViewModel(gridModelInfo, i, materialInfo);
            }
          });
        });
      }
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
  gridModelInfo
    .getEditRowModel()
    .get("doubleCheckPassword")
    .on("blur", function () {
      let value = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "doubleCheckPassword");
      if (value != "输入完成") {
        gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "doubleCheckPasswordDisable", value);
        gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "doubleCheckPassword", "输入完成");
      }
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
      let org_id = viewModel.get("org_id").getValue();
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
    if (data.value == undefined || data.value.id != data.oldValue.id) {
      viewModel.get("checker").setValue(null);
      viewModel.get("checker_name").setValue(null);
    }
  });
  viewModel.on("beforeSave", function () {
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    let passwordsJson = {};
    for (var i = 0; i < gridModelInfo.getRows().length; i++) {
      //复核数量
      let checkQty = parseFloat(gridModelInfo.getCellValue(i, "checkQty"));
      //复核合格数量
      let qualifie_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "qualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "qualifie_qty"));
      //复核不合格数量
      let unqualifie_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "unqualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "unqualifie_qty"));
      //复核不确定数量
      let uncertain_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"));
      //是否二次复核
      let isdouble_check = gridModelInfo.getCellValue(i, "isdouble_check");
      if (checkQty <= 0) {
        errorMsg += "第" + (i + 1) + "行数据 检验不能 <= 0\n";
      } else {
        if (qualifie_qty + unqualifie_qty + uncertain_qty != checkQty) {
          errorMsg += "第" + (i + 1) + "行数据 检验合格数量+检验不合格数量+检验不确定数量 !=  检验数量,请重新填写\n";
        }
      }
      if (isdouble_check == 1) {
        passwordsJson[gridModelInfo.getCellValue(i, "double_checker")] = {
          index: i,
          doubleCheckPasswordDisable: gridModelInfo.getCellValue(i, "doubleCheckPasswordDisable")
        };
      }
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
          passwordsJson[gridModelInfo.getCellValue(i, "double_checker")] = {
            index: i,
            doubleCheckPasswordDisable: gridModelInfo.getCellValue(i, "doubleCheckPasswordDisable")
          };
        }
      }
    }
    //遍历密码数组生成json
    if (Object.keys(passwordsJson).length > 0) {
      let querySql = "select id,pass_ec from GT22176AT10.GT22176AT10.SY01_secondaccepter where id in (";
      for (var key in passwordsJson) {
        querySql += "'" + key + "',";
      }
      querySql = querySql.substring(0, querySql.length - 1) + ")";
      promises.push(validatePassword(querySql, passwordsJson).then(handerMessage));
    }
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
  function validateSourceQty(gridModelInfo) {
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
  }
  validatePassword = function (querySql, passwordsJson) {
    return new Promise(function (resolve) {
      let message = "";
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.queryBySql", { sql: querySql }, function (err, res) {
        if (typeof res !== "undefined") {
          for (let i = 0, len = res.data.length; i < len; i++) {
            if (
              !(
                typeof res.data[0].pass_ec != "undefined" &&
                typeof passwordsJson[res.data[0].id].doubleCheckPasswordDisable != "undefined" &&
                res.data[0].pass_ec == passwordsJson[res.data[0].id].doubleCheckPasswordDisable
              )
            ) {
              message += "第" + (passwordsJson[res.data[0].id].index + 1) + "行密码错误\n";
            }
          }
        } else if (err !== null) {
          message += "密码查询接口报错\n";
        }
        resolve(message);
      });
    });
  };
  function gjtcfh_parseDate(date) {
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
  }
  gjtcfh_getCustomerInfo = function (materialId, orgId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getProductDetail",
        {
          materialId: materialId,
          orgId: orgId
        },
        function (err, res) {
          if (typeof res !== "undefined") {
            resolve(res.merchantInfo);
          } else if (err !== null) {
            alert(err.message);
          }
        }
      );
    });
  };
};