run = function (event) {
  var viewModel = this;
  var gridModelInfo = viewModel.get("SY01_purinstockys_lList");
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
  let updateViewModel = function (gridModelInfo, i, materialInfo) {
    let extend_gsp_spfl = materialInfo.extend_gsp_spfl;
    gridModelInfo.setCellValue(i, "gsp_material_type", extend_gsp_spfl);
    let isDoubleCheck = getSwitchValue(materialInfo.issecacceptance);
    gridModelInfo.setCellValue(i, "isdouble_check", isDoubleCheck);
    //如果不是二次验收的物料，那么二次验收人和密码不可以填写
    if (isDoubleCheck == 0) {
      gridModelInfo.setCellState(i, "double_checker_name", "readOnly", true);
      gridModelInfo.setCellState(i, "checker_password", "readOnly", true);
    }
    let isBatch = getSwitchValue(materialInfo.isBatchManage);
    let isValid = getSwitchValue(materialInfo.isExpiryDateManage);
    gridModelInfo.setCellValue(i, "is_bath_manage", trueOfFalse(isBatch));
    gridModelInfo.setCellValue(i, "is_expire_manage", trueOfFalse(isValid));
    //保质期
    gridModelInfo.setCellValue(i, "shelf_life", materialInfo.expireDateNo);
    //保质期单位
    gridModelInfo.setCellValue(i, "expire_date_unit", materialInfo.expireDateUnit);
    if (isBatch == 1 && isValid == 1) {
      //是批次管理也是效期管理，生产日期，有效期至必填？
      gridModelInfo.getEditRowModel().get("manufact_date").setState("bIsNull", false);
      gridModelInfo.getEditRowModel().get("valid_until").setState("bIsNull", false);
    } else if (isBatch == 1 && isValid == 0) {
      //是批号管理，但是不是效期管理，生产日期、有效期至不可填写
      gridModelInfo.setCellState(i, "manufact_date", "readOnly", true);
      gridModelInfo.setCellState(i, "valid_until", "readOnly", true);
    } else if (isBatch == 0 && isValid == 0) {
      //不是批号管理，也不是效期管理，批次、生产日期、有效期至不可填写
      gridModelInfo.setCellState(i, "manufact_date", "readOnly", true);
      gridModelInfo.setCellState(i, "valid_until", "readOnly", true);
      gridModelInfo.setCellState(i, "batchno_batchno", "readOnly", true);
      gridModelInfo.setCellState(i, "batch_no", "readOnly", true);
    }
  };
  gridModelInfo
    .getEditRowModel()
    .get("manufact_date")
    .on("blur", function (data) {
      let index = gridModelInfo.getFocusedRowIndex();
      let manufactDate = gridModelInfo.getEditRowModel().get("manufact_date").getValue();
      let expireDateUnit = gridModelInfo.getEditRowModel().get("expire_date_unit").getValue();
      let shelfLife = gridModelInfo.getEditRowModel().get("shelf_life").getValue();
      if (typeof manufactDate != "undefined" && typeof expireDateUnit != "undefined" && typeof shelfLife != "undefined") {
        let date = addDate(manufactDate, expireDateUnit, shelfLife);
        gridModelInfo.setCellValue(index, "valid_until", date);
      } else if (typeof manufactDate == "undefined") {
        gridModelInfo.setCellValue(index, "valid_until", "");
      }
    });
  gridModelInfo
    .getEditRowModel()
    .get("valid_until")
    .on("blur", function (data) {
      let index = gridModelInfo.getFocusedRowIndex();
      let manufactDate = gridModelInfo.getEditRowModel().get("manufact_date").getValue();
      let expireDateUnit = gridModelInfo.getEditRowModel().get("expire_date_unit").getValue();
      let shelfLife = gridModelInfo.getEditRowModel().get("shelf_life").getValue();
      if (typeof manufactDate == "undefined" && typeof expireDateUnit == "undefined" && typeof shelfLife == "undefined") {
        gridModelInfo.setCellValue(index, "valid_until", "");
        cb.utils.alert("请先填写[生产日期,保质期,保质期单位]");
      }
    });
  //自动带出验收员(默认组织正确的情况)
  viewModel.on("modeChange", function (data) {
    if (data === "add" || data == "edit") {
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
      });
      //有大问题，这个地方需要重写，先return
      let org_id = viewModel.get("org_id").getValue();
      let rows = gridModelInfo.getRows();
      for (let i = 0; i < rows.length; i++) {
        getProLicInfo(false, rows[i].material, org_id).then((materialInfo) => {
          if (materialInfo == null || materialInfo == undefined) {
            getProSkuLicInfo(rows[i].material, rows[i].sku_code, org_id).then((materialInfo) => {
              updateViewModel(gridModelInfo, i, materialInfo);
            });
          } else {
            updateViewModel(gridModelInfo, i, materialInfo);
          }
        });
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
      if (value != "输入完成") {
        gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "checker_password_display", value);
        gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "checker_password", "输入完成");
      }
      if (value == "" || value == undefined || value == null || value == "密码不能为空!") {
        gridModelInfo.setCellValue(gridModelInfo.getFocusedRowIndex(), "checker_password", "密码不能为空!");
      }
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
  viewModel.on("beforeSave", function () {
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    let checkCount = [];
    for (var i = 0; i < gridModelInfo.getRows().length; i++) {
      let materialCode = gridModelInfo.getCellValue(i, "material_code");
      let checkQty = parseFloat(gridModelInfo.getCellValue(i, "checkQty"));
      checkCount[i] = checkQty;
      //检验合格数量
      let qualifie_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "qualifie_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "qualifie_qty"));
      //检验拒收数量
      let refuse_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "refuse_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "refuse_qty"));
      //检验不确定数量
      let uncertain_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "uncertain_qty"));
      //是否二次复核
      let isDoubleCheck = gridModelInfo.getCellValue(i, "isdouble_check");
      if (checkQty <= 0) {
        errorMsg += "编码为:" + materialCode + "的物料 检验不能 <= 0\n";
      } else {
        if (qualifie_qty + uncertain_qty + refuse_qty != checkQty) {
          errorMsg += "编码为:" + materialCode + "的物料 检验合格数量+检验不确定数量+检验拒收数量!= 检验数量,请重新填写\n"; //+检验不合格数量
        }
      }
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
          errorMsg += "编码为:" + materialCode + "的物料需要双人复核,请填写二次验收人和密码\n"; //+检验不合格数量
        } else {
          promises.push(validatePassword(i, double_checker, checker_password_display).then(handerMessage));
        }
      }
    }
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
    cb.rest.invokeFunction1 = function (id, data, callback, options) {
      var proxy = cb.rest.DynamicProxy.create({
        doProxy: {
          url: "/web/function/invoke/" + id,
          method: "POST",
          options: options
        }
      });
      proxy.doProxy(data, callback);
    };
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
  function validatePassword(index, id, password) {
    return new Promise(function (resolve) {
      let message = "";
      if (typeof id == "undefined") {
        message += "第" + (index + 1) + "二次验收人没有填写\n";
        resolve(message);
        return;
      }
      let querySql = "select pass_ec from GT22176AT10.GT22176AT10.SY01_secondaccepter where id ='" + id + "'";
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.queryBySql", { sql: querySql }, function (err, res) {
        if (typeof res !== "undefined") {
          for (let i = 0, len = res.data.length; i < len; i++) {
            if (!(typeof res.data[0].pass_ec != "undefined" && typeof password != "undefined" && res.data[0].pass_ec == password)) message += "第" + (index + 1) + "行密码错误\n";
          }
        } else if (err !== null) {
          message += "第" + (index + 1) + "密码查询接口报错\n";
        }
        resolve(message);
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
      cb.rest.invokeFunction1(
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
  function addDate(manufactDate, expireDateUnit, shelfLife) {
    let year;
    let month;
    let day;
    let dateTime;
    manufactDate = new Date(manufactDate);
    if (expireDateUnit == "1") {
      year = manufactDate.getFullYear(); //加年
      year = year + shelfLife;
      month = (manufactDate.getMonth() + 1).toString();
      day = manufactDate.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
    } else if (expireDateUnit == "2") {
      month = manufactDate.getMonth() + shelfLife + 1; //加月
      year = manufactDate.getFullYear();
      day = manufactDate.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
    } else if (expireDateUnit == "3") {
      day = manufactDate.getDate() + shelfLife; //加天
      year = manufactDate.getFullYear();
      month = (manufactDate.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
    }
    dateTime = year + "-" + month + "-" + day;
    return dateTime;
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
};