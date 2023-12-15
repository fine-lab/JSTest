viewModel.on("customInit", function (data) {
  var gridModelInfo = viewModel.getGridModel("SY01_pro_sreport_v3List");
  gridModelInfo
    .getEditRowModel()
    .get("features")
    .on("afterCharacterModels", function (data) {
      debugger;
      if (viewModel.getParams().mode == "add") {
        cb.rest.invokeFunction(
          "GT22176AT10.backDefaultGroup.addUseless",
          {
            masterId: masterId,
            orgIds: orgIds,
            orgNames: orgNames
          },
          function (err, res) {
            if (typeof res != "undefind") {
              let childDataInfo = res.data[0].SY01_pro_sreport_v3List;
              if (childDataInfo.length > 0) {
                for (let i = 0; i < childDataInfo.length; i++) {
                  gridModel.setCellValue(i, "features", childDataInfo[i].features);
                }
              }
            }
          }
        );
      }
    });
  gridModelInfo
    .getEditRowModel()
    .get("pcnum_batchno")
    .on("beforeBrowse", function () {
      let index = gridModelInfo.getFocusedRowIndex();
      let product = gridModelInfo.getCellValue(index, "commodity_code");
      let warehouse = gridModelInfo.getCellValue(index, "warehouse");
      if (warehouse == undefined || warehouse == null || warehouse == "") {
        cb.utils.alert("请先选择仓库", "error");
        return false;
      }
      if (product == undefined || product == "") {
        cb.utils.alert("请先选择物料", "error");
      } else {
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        //是否gsp物料
        condition.simpleVOs.push({
          field: "product",
          op: "eq",
          value1: product
        });
        condition.simpleVOs.push({
          field: "warehouse",
          op: "eq",
          value1: warehouse
        });
        this.setFilter(condition);
      }
    });
  viewModel.on("afterLoadData", function (data) {
    var gridModelDetails = viewModel.getGridModel("SY01_pro_sreport_v3List").get("dataSource");
    var gridModel = viewModel.getGridModel("SY01_pro_sreport_v3List");
    if (viewModel.getParams().mode == "add") {
      let dataInfo = viewModel.getParams().dataInfo;
      if (dataInfo != null && dataInfo != undefined && dataInfo.length > 0) {
        debugger;
        viewModel.get("org_id").setValue(dataInfo[0].org_id); //组织ID
        viewModel.get("org_id_name").setValue(dataInfo[0].org_id_name); //组织名称
        viewModel.get("verifystate").setValue(dataInfo[0].verifystate); //单据状态
        viewModel.get("bizFlowName").setValue(dataInfo[0].bizFlowName); //流程名称
        let childDataInfo = dataInfo[0].SY01_pro_sreport_v3List;
        if (childDataInfo.length > 0) {
          for (let i = 0; i < childDataInfo.length; i++) {
            childDataInfo[i].childList.features = childDataInfo[i].features.features;
            gridModel.insertRow(i, childDataInfo[i].childList);
          }
        }
      }
      let selectData = viewModel.getParams().selectData;
      let orgId = viewModel.getParams().orgId;
      let orgName = viewModel.getParams().orgName;
      if (selectData != null && selectData != undefined) {
        getFinaceOrg(orgId).then(
          (result) => {
            for (let i = 0; i < selectData.length; i++) {
              selectData[i].commodity_code = selectData[i].product_code;
              selectData[i].commodity_code_code = selectData[i].product_code_code;
              selectData[i].commodity_name = selectData[i].product_name;
              selectData[i].applications_number = selectData[i].currentStockNum;
              selectData[i].stockstate_name = selectData[i].stockstate_statusName;
              selectData[i].skuid_name = selectData[i].skuname;
              selectData[i].pcnum_batchno = selectData[i].lot_num_batchno;
              selectData[i].pctext = selectData[i].lot_num_batchno;
              selectData[i].skucode = selectData[i].skuid_code;
              selectData[i].manufacture_date = selectData[i].production_date;
              selectData[i].validity_date = selectData[i].valid_until;
              selectData[i].position_name = selectData[i].huowei_name;
              selectData[i].position = selectData[i].huowei;
              gridModelInfo.insertRow(i, selectData[i]);
              //物料id
              let productId = selectData[i].product_code;
              let finOrg = result;
              cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { materialId: productId, orgId: finOrg }, function (err, res) {
                console.log();
                if (res != undefined) {
                  let productInfo = res.proLicInfo;
                  //上市许可持有人
                  gridModelInfo.setCellValue(i, "holder", productInfo.listingHolder);
                  gridModelInfo.setCellValue(i, "holder_ip_name", productInfo.listingHolderName);
                  //生产厂商
                  gridModelInfo.setCellValue(i, "stripe_code", productInfo.manufacturer);
                  //产地
                  gridModelInfo.setCellValue(i, "origin", productInfo.producingArea);
                  //批准文号
                  gridModelInfo.setCellValue(i, "pzwh", productInfo.approvalNumber);
                  //规格说明
                  gridModelInfo.setCellValue(i, "model", productInfo.specs);
                  // 规格
                  gridModelInfo.setCellValue(i, "specs", productInfo.specs);
                  // 型号
                  gridModelInfo.setCellValue(i, "model", productInfo.model);
                  //计量单位
                  gridModelInfo.setCellValue(i, "main_unit", productInfo.mainUnit);
                  gridModelInfo.setCellValue(i, "main_unit_name", productInfo.mainUnitName);
                  //剂型
                  gridModelInfo.setCellValue(i, "dosage", productInfo.dosageForm);
                  gridModelInfo.setCellValue(i, "dosage_dosagaFormName", productInfo.dosageFormName);
                  //通用名
                  gridModelInfo.setCellValue(i, "currency_name", productInfo.commonNme);
                  //包材
                  gridModelInfo.setCellValue(i, "bc", productInfo.packingMaterial);
                  gridModelInfo.setCellValue(i, "bc_packing_name", productInfo.packingMaterialName);
                }
              });
            }
            gridModelInfo.deleteRows(selectData.length - 1);
          },
          (err) => {}
        );
        viewModel.get("org_id").setValue(orgId);
        viewModel.get("org_id_name").setValue(orgName);
      }
    }
    for (var i = 0; i < gridModelDetails.length; i++) {
      let productsku = gridModelDetails[i].holder_id;
    }
    viewModel.on("modeChange", function (data) {
      let recheckMan = viewModel.get("staff").getValue();
      if ((data === "add" || data === "edit") && (recheckMan == "" || recheckMan == null)) {
        //获取当前用户对应的员工，赋值给复核人员
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("staff").setValue(res.staffOfCurrentUser.id);
            viewModel.get("staff_name").setValue(res.staffOfCurrentUser.name);
            viewModel.get("department").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("department_name").setValue(res.staffOfCurrentUser.deptName);
          }
        });
      }
    });
  });
  viewModel.get("department_name").on("beforeBrowse", function (data) {
    var externalData = {};
    externalData.ref_parentorgid = viewModel.get("org_id").getValue();
    (externalData.funcCode = "all"), (externalData.accountdelegate = "true"), viewModel.get("department_name").setState("externalData", externalData);
  });
  //部门切换，或清空，清空验收员
  viewModel.get("department_name").on("afterValueChange", function (data) {
    if (data.value == null || (data.oldValue != null && data.value.id != data.oldValue.id)) {
      viewModel.get("staff").setValue(null);
      viewModel.get("staff_name").setValue(null);
    }
  });
  viewModel.on("beforePush", function (args) {
    var verifystate = viewModel.getAllData().verifystate;
    if (2 != verifystate) {
      cb.utils.alert("未审核的单据不允许下推!");
      return false;
    }
    let returnPromise = new cb.promise();
    let id = viewModel.get("id").getValue();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.pushOtherCheck",
      {
        ids: [id]
      },
      function (err, res) {
        if (err != undefined) {
          cb.utils.alert(err.message, "error");
          returnPromise.reject();
        }
        if (res != undefined) {
          if (res.message.length > 0) {
            cb.utils.alert(res.message, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
          }
        }
      }
    );
    return returnPromise;
  });
  viewModel.on("beforeSave", function (args) {
    debugger;
    var gridModelDetails1 = viewModel.getGridModel("SY01_pro_sreport_v3List").get("dataSource");
    var gridModel1 = viewModel.getGridModel("SY01_pro_sreport_v3List");
    for (var i = 0; i < gridModelDetails1.length; i++) {
      let qty = gridModelDetails1[i].applications_number;
      if (!qty > 0) {
        cb.utils.alert("申请数量不能为空!");
        return false;
      }
    }
    let promises = [];
    let childData = viewModel.getGridModel("SY01_pro_sreport_v3List").get("dataSource");
    let masterIds = [];
    if (childData.length > 0) {
      for (let i = 0; i < childData.length; i++) {
        masterIds.push(childData[i].source_id);
      }
    }
    promises.push(
      updateBadDrug(masterIds).then((res) => {
        res;
      })
    );
  });
  viewModel.get("staff_name").on("beforeBrowse", function () {
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
  //根据审核状态控制按钮显示
  function updateBadDrug(masterIds) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.updateBadDrug",
        {
          masterIds: masterIds
        },
        function (err, res) {
          if (typeof res != "undefined") {
            resolve(res);
          } else if (typeof err != "undefined") {
            cb.utils.alert(err);
            return false;
          }
          resolve();
        }
      );
    });
  }
  function getFinaceOrg(orgid) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getFinaceOrg", { orgid: orgid }, function (err, res) {
        if (res.info) {
          resolve(res.info[0].finorgid);
        }
        if (err != undefined) {
          reject();
        }
      });
    });
  }
});