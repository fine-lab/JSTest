run = function (event) {
  var viewModel = this;
  var gridModelInfo = viewModel.get("SY01_purinstockys_lList");
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
  let getSwitchValue = function (value) {
    if (value == undefined || value == null || value == 0 || value == "0" || value == false || value == "false") {
      return 0;
    } else {
      return 1;
    }
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
  //获取物料近效期拒收天数
  let iDaysBeforeValidityReject = function (materialId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getValidReject", { materialId: materialId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.iDaysBeforeValidityReject);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  let updateViewModel = function (gridModelInfo, i, materialInfo) {
    gridModelInfo.setCellValue(i, "gsp_material_type", materialInfo.materialType, true);
    gridModelInfo.setCellValue(i, "gsp_material_type_catagoryname", materialInfo.materialTypeName, true);
    let isDoubleCheck = getSwitchValue(materialInfo.doubleReview);
    gridModelInfo.setCellValue(i, "isdouble_check", isDoubleCheck, true);
    //如果不是二次验收的物料，那么二次验收人和密码不可以填写
    if (isDoubleCheck == 0) {
      gridModelInfo.setCellState(i, "double_checker_name", "readOnly", true);
      gridModelInfo.setCellState(i, "checker_password", "readOnly", true);
    }
    let isBatch = getSwitchValue(materialInfo.isBatchManage);
    let isValid = getSwitchValue(materialInfo.isExpiryDateManage);
    gridModelInfo.setCellValue(i, "is_bath_manage", isBatch, true);
    gridModelInfo.setCellValue(i, "is_expire_manage", isValid, true);
    //保质期
    gridModelInfo.setCellValue(i, "shelf_life", materialInfo.expireDateNo, true);
    //保质期单位
    gridModelInfo.setCellValue(i, "expire_date_unit", materialInfo.expireDateUnit, true);
    //有效期推算方式
    gridModelInfo.setCellValue(i, "isExpiryDateCalculationMethod", materialInfo.isExpiryDateCalculationMethod, true);
    if (isBatch == 1) {
      gridModelInfo.setCellState(i, "batch_no", "bIsNull", false);
      if (isValid == 1) {
        gridModelInfo.setCellState(i, "manufact_date", "bIsNull", false);
        gridModelInfo.setCellState(i, "valid_until", "bIsNull", false);
      } else {
        //是批号管理，但是不是效期管理，生产日期、有效期至不可填写
        gridModelInfo.setCellState(i, "manufact_date", "readOnly", true);
        gridModelInfo.setCellState(i, "valid_until", "readOnly", true);
      }
    } else if (isBatch == 0 && isValid == 0) {
      //不是批号管理，也不是效期管理，批次、生产日期、有效期至不可填写
      gridModelInfo.setCellState(i, "manufact_date", "readOnly", true);
      gridModelInfo.setCellState(i, "valid_until", "readOnly", true);
      gridModelInfo.setCellState(i, "batchno_batchno", "readOnly", true);
      gridModelInfo.setCellState(i, "batch_no", "readOnly", true);
    }
  };
  //自动带出验收员(默认组织正确的情况)
  viewModel.on("modeChange", function (data) {
    if (data === "add") {
      //设置默认单据日期
      viewModel.get("inspectDate").setValue(gjrkys_parseDate(new Date()));
      //获取当前用户对应的部门员工，赋值给复核人员
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
        if (res != undefined && res.staffOfCurrentUser != undefined) {
          viewModel.get("inspecter").setValue(res.staffOfCurrentUser.id);
          viewModel.get("inspecter_name").setValue(res.staffOfCurrentUser.name);
          viewModel.get("inspectDep").setValue(res.staffOfCurrentUser.deptId);
          viewModel.get("inspectDep_name").setValue(res.staffOfCurrentUser.deptName);
        }
        if (err != null) {
          cb.utils.alert(err.message, "error");
        }
      });
      //有大问题，这个地方需要重写，先return
      let org_id = viewModel.get("inspectOrg").getValue();
      let rows = gridModelInfo.getRows();
      for (let i = 0; i < rows.length; i++) {
        getProLicInfo(false, rows[i].material, org_id).then(
          (materialInfo) => {
            if (materialInfo == null || materialInfo == undefined) {
              getProSkuLicInfo(rows[i].material, rows[i].sku_code, org_id).then(
                (materialInfo) => {
                  updateViewModel(gridModelInfo, i, materialInfo);
                },
                (err) => {
                  cb.utils.alert(err.message, "error");
                }
              );
            } else {
              updateViewModel(gridModelInfo, i, materialInfo);
            }
          },
          (err) => {
            cb.utils.alert(err.message, "error");
          }
        );
      }
    }
  });
  gridModelInfo.on("afterMount", function () {
    gridModelInfo.setColumnState("checker_password", "type", "password");
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
        gridModelInfo.setCellState(i, "checker_password", "readOnly", true);
      }
    }
  });
  gridModelInfo
    .getEditRowModel()
    .get("checker_password")
    .on("blur", function () {
      let value = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "checker_password");
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "checker_password_display", value);
      let str = "";
      if (value != undefined && value != null && value != "") {
        for (let i = 0; i < value.length; i++) {
          str += "●";
        }
        gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "checker_password", str);
      }
    });
  gridModelInfo
    .getEditRowModel()
    .get("checker_password")
    .on("focus", function () {
      let value = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "checker_password_display");
      gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "checker_password", value);
    });
  //部门选择控制
  //验收员选择控制
  viewModel.get("inspecter_name").on("beforeBrowse", function (data) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    let dep_id = viewModel.get("inspectDep").getValue();
    let orgId = viewModel.get("org_id").getValue();
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
        value1: orgId
      });
    }
    this.setFilter(condition);
  });
  //部门过滤控制
  //仓库过滤控制
  //货位过滤控制
  gridModelInfo
    .getEditRowModel()
    .get("position_name")
    .on("beforeBrowse", function (data) {
      let warehouse = gridModelInfo.getEditRowModel().get("warehouse").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "warehouseId",
        op: "eq",
        value1: warehouse
      });
      this.setFilter(condition);
    });
  //二次验收人过滤
  gridModelInfo
    .getEditRowModel()
    .get("double_checker_name")
    .on("beforeBrowse", function (data) {
      let org_id = viewModel.get("inspectOrg").getValue();
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
  //验收员选择完之后，自动带出部门
  viewModel.get("inspecter_name").on("afterValueChange", function (data) {
    let dep_id = viewModel.get("inspectDep").getValue();
    if (data.value != null && dep_id == null && (data.oldValue == null || data.value.id != data.oldValue.id)) {
      viewModel.get("inspectDep").setValue(data.value.dept_id);
      viewModel.get("inspectDep_name").setValue(data.value.dept_id_name);
    }
  });
  //部门切换，或清空，清空验收员
  viewModel.get("inspectDep_name").on("afterValueChange", function (data) {
    if (data.value == null || (data.oldValue != null && data.value.id != data.oldValue.id)) {
      viewModel.get("inspecter").setValue(null);
      viewModel.get("inspecter_name").setValue(null);
    }
  });
  //数量不能小于0
  gridModelInfo.on("beforeCellValueChange", function (data) {
    if (data.cellName == "qualifie_qty" || data.cellName == "unqualifie_qty" || data.cellName == "uncertain_qty") {
      if (data.value < 0) {
        cb.utils.alert("数量不能小于0", "error");
        return false;
      }
    }
  });
  gridModelInfo.on("afterCellValueChange", function (data) {
    if (data.cellName == "unqualifie_qty") {
      if (data.value > 0) {
        gridModelInfo.setCellState(data.rowIndex, "unquaDealType", "bIsNull", false);
      } else {
        gridModelInfo.setCellState(data.rowIndex, "unquaDealType", "bIsNull", true);
      }
      let unquaDealType = gridModelInfo.getCellValue(data.rowIndex, "unquaDealType");
      if (unquaDealType == 1 || unquaDealType == "1") {
        gridModelInfo.setCellValue(data.rowIndex, "unQuaNeedInQty", data.value);
      }
      if (unquaDealType == 2 || unquaDealType == "2") {
        gridModelInfo.setCellValue(data.rowIndex, "refuse_qty", data.value);
      }
    }
    if (data.cellName == "unquaDealType") {
      let unqualifie_qty = gridModelInfo.getCellValue(data.rowIndex, "unqualifie_qty");
      if (data.value.value == 1 || data.value.value == "1") {
        gridModelInfo.setCellValue(data.rowIndex, "unQuaNeedInQty", unqualifie_qty);
        gridModelInfo.setCellValue(data.rowIndex, "refuse_qty", 0);
      }
      if (data.value.value == 2 || data.value.value == "2") {
        gridModelInfo.setCellValue(data.rowIndex, "unQuaNeedInQty", 0);
        gridModelInfo.setCellValue(data.rowIndex, "refuse_qty", unqualifie_qty);
      }
      if (data.value == null) {
        gridModelInfo.setCellValue(data.rowIndex, "unQuaNeedInQty", 0);
        gridModelInfo.setCellValue(data.rowIndex, "refuse_qty", 0);
      }
    }
    if (data.cellName == "batchno_batchno") {
      let produceDate = gridModelInfo.getCellValue(data.rowIndex, "manufact_date");
      let expireDate = gridModelInfo.getCellValue(data.rowIndex, "valid_until");
      if (undefined != produceDate && "" != produceDate) {
        gridModelInfo.setCellValue(data.rowIndex, "manufact_date", new Date(produceDate).format("yyyy-MM-dd"));
      }
      if (undefined != expireDate && "" != expireDate) {
        gridModelInfo.setCellValue(data.rowIndex, "valid_until", new Date(expireDate).format("yyyy-MM-dd"));
      }
    }
    if (data.cellName == "manufact_date" && data.value != null) {
      let produceDate = gridModelInfo.getCellValue(data.rowIndex, "manufact_date");
      gridModelInfo.setCellValue(data.rowIndex, "manufact_date", new Date(produceDate).format("yyyy-MM-dd"));
    }
    if (data.cellName == "valid_until" && data.value != null) {
      let expireDate = gridModelInfo.getCellValue(data.rowIndex, "valid_until");
      gridModelInfo.setCellValue(data.rowIndex, "valid_until", new Date(expireDate).format("yyyy-MM-dd"));
    }
  });
  //复制行时，检验数量不复制
  gridModelInfo.on("afterInsertRow", function (data) {
    gridModelInfo.setCellValue(data.index, "checkQty", 0);
  });
  viewModel.on("beforeSave", function () {
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    //先计算数量是否填写正确
    let qtyInfo = {};
    for (var i = 0; i < gridModelInfo.getRows().length; i++) {
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
      qtyInfo[sourceEntryId]["qualifie_qty"] += isNaN(parseFloat(gridModelInfo.getCellValue(i, "qualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "qualifie_qty"));
      qtyInfo[sourceEntryId]["unqualifie_qty"] += isNaN(parseFloat(gridModelInfo.getCellValue(i, "unqualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "unqualifie_qty"));
      qtyInfo[sourceEntryId]["uncertain_qty"] += isNaN(parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"));
    }
    for (let key in qtyInfo) {
      if (qtyInfo[key]["qualifie_qty"] + qtyInfo[key]["unqualifie_qty"] + qtyInfo[key]["uncertain_qty"] != qtyInfo[key]["checkQty"]) {
        errorMsg += printArray(qtyInfo[key]["index"]) + ",检验合格数量 + 检验不合格数量 + 检验不确定数量 != 检验数量,请重新填写\n";
      }
    }
    if (errorMsg.length > 0) {
      cb.utils.alert(errorMsg, "error");
      return false;
    }
    let passwordJson = [];
    for (var i = 0; i < gridModelInfo.getRows().length; i++) {
      let isBatchManage = gridModelInfo.getCellValue(i, "is_bath_manage");
      let isExpireManage = gridModelInfo.getCellValue(i, "is_expire_manage");
      let batchNo = gridModelInfo.getCellValue(i, "batch_no");
      let produceDate = gridModelInfo.getCellValue(i, "manufact_date");
      let expireDate = gridModelInfo.getCellValue(i, "valid_until");
      if ((isBatchManage == true || isBatchManage == "true") && (batchNo == undefined || batchNo == "")) {
        errorMsg += "第" + (i + 1) + "行是批次管理物料，请填写批号\n"; //+检验不合格数量
      }
      //效期分多种情况，如果有效期推算方式为不推算
      //暂不考虑，有效期和生产日期都必须填写
      if ((isExpireManage == true || isExpireManage == "true") && (produceDate == undefined || expireDate == undefined)) {
        errorMsg += "第" + (i + 1) + "行是效期管理物料，生产日期和有效期至必填\n"; //+检验不合格数量
      }
      //物料近效期拒收（新增代码）
      let materialID = gridModelInfo.getCellValue(i, "material");
      let manufact_date = gridModelInfo.getCellValue(i, "manufact_date");
      let valid_until = gridModelInfo.getCellValue(i, "valid_until");
      if (valid_until != "undefined") {
        let currentDate = new Date().getTime();
        iDaysBeforeValidityReject(materialID).then(
          (res) => {
            let daysBeforeValidityReject = res == undefined ? 0 : res;
            let endTime = parseInt((new Date(valid_until).getTime() / 1000 - parseInt(currentDate / 1000)) / 60 / 60 / 24);
            if (endTime < daysBeforeValidityReject) {
              errorMsg += "第" + (i + 1) + "的物料有效期天数小于近效期拒收天数\n";
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
    let orgId = viewModel.get("inspectOrg").getValue();
    getGspParams(orgId).then((res) => {
      if (res.gspParameterArray[0].isgspmanage != undefined && res.gspParameterArray[0].isgspmanage != 0 && res.gspParameterArray[0].isgspmanage != "0") {
        for (let i = 0; i < gridModelInfo.getRows().length; i++) {
          let isDoubleCheck = gridModelInfo.getCellValue(i, "isdouble_check");
          if (isDoubleCheck == 1 || isDoubleCheck == "1" || isDoubleCheck == true || isDoubleCheck == "true") {
            let double_checker = gridModelInfo.getCellValue(i, "double_checker");
            let checker_password_display = gridModelInfo.getCellValue(i, "checker_password_display");
            if (
              double_checker == undefined ||
              double_checker == "" ||
              double_checker == null ||
              checker_password_display == "" ||
              checker_password_display == undefined ||
              checker_password_display == null
            ) {
              errorMsg += "第" + (i + 1) + "物料需要双人复核,请填写二次验收人和密码\n"; //+检验不合格数量
            } else {
              passwordJson.push({
                index: i + 1,
                doubleCheck: double_checker,
                password: checker_password_display
              });
            }
          }
        }
        promises.push(validatePassword(passwordJson).then(handerMessage));
      }
    });
    promises.push(validateSourceQty(gridModelInfo).then(handerMessage));
    let promise = new cb.promise();
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
    if (data.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      if (viewModel.get("verifystate").getValue() != 2) {
        errorMsg += "单据未审核,不能下推质量复查";
      } else {
        let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
        let request = { id: viewModel.get("id").getValue(), uri: "GT22176AT10.GT22176AT10.Sy01_quareview" };
        promises.push(validateLowerState(apiUrl, request).then(handerMessage));
      }
      let pushFlag = false;
      for (let i = 0; i < gridModelInfo.getRows().length; i++) {
        let uncertain_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"));
        let review_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "review_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "review_qty"));
        if (uncertain_qty - review_qty > 0) {
          pushFlag = true;
          break;
        }
      }
      if (!pushFlag) {
        errorMsg += "无可下推质量复查数量\n";
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
    } else if (data.params.cSvcUrl.indexOf("targetBillNo=6a247d71") > 0) {
      if (viewModel.get("verifystate").getValue() != 2) {
        errorMsg += "单据未审核,不能下推拒收单";
      } else {
        let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
        let request = { id: viewModel.get("id").getValue(), uri: "GT22176AT10.GT22176AT10.SY01_medcrefusev2" };
        promises.push(validateLowerState(apiUrl, request).then(handerMessage));
      }
      let pushFlag = false;
      for (let i = 0; i < gridModelInfo.getRows().length; i++) {
        let refuse_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "refuse_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "refuse_qty"));
        let total_refuse_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "total_refuse_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "total_refuse_qty"));
        let rejection_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "rejection_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "rejection_qty"));
        if (refuse_qty + total_refuse_qty - rejection_qty > 0) {
          pushFlag = true;
          break;
        }
      }
      if (!pushFlag) {
        errorMsg += "无可下推拒收单数量\n";
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
  function validatePassword(passwordJson) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.validatePassword", { passwordJson: passwordJson }, function (err, res) {
        if (typeof res !== "undefined") {
          resolve(res.errorMsg);
        } else if (err !== null) {
          resolve("密码查询接口报错,validatePassword");
        }
      });
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
          let arrivalInfo = JSON.parse(res.apiResponse).data;
          for (let i = 0; i < gridModelInfo.getRows().length; i++) {
            for (let j = 0; j < arrivalInfo.arrivalOrders.length; j++) {
              if (gridModelInfo.getCellValue(i, "sourcechild_id") == arrivalInfo.arrivalOrders[j].id.toString()) {
                if (gridModelInfo.getCellValue(i, "checkQty") > arrivalInfo.arrivalOrders[j].acceptqty - arrivalInfo.arrivalOrders[j].extend_associate_sample_qty) {
                  message += "第" + (i + 1) + "检验数量不能 > 到货单.到货数量-到货单.累计验收数量\n";
                }
                continue;
              }
            }
          }
        } else if (err !== null) {
          message += "到货单接口查询接口报错\n";
        }
        resolve(message);
      });
    });
  }
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
  function trueOfFalse(value) {
    if (value == 1 || value == "1" || value == true || value == "true") {
      return "true";
    } else if (value == 0 || value == "0" || value == false || value == "false" || value == undefined || value == null || value == "") {
      return "false";
    }
  }
  function gjrkys_parseDate(date) {
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
  gjrkys_getCustomerInfo = function (materialId, orgId) {
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
};