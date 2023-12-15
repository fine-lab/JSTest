run = function (event) {
  var viewModel = this;
  const scopeGridModelInfo = viewModel.getGridModel("SY01_supply_licences_rangeList"); //证照孙表
  const licenseGridModelInfo = viewModel.get("SY01_supply_licencesList"); //证照子表
  const scopeFwGridModelInfo = viewModel.getGridModel("SY01_supply_attorney_rangeList"); //授权委托书孙表
  const licenseFwGridModelInfo = viewModel.get("SY01_supply_attorneyList"); //授权委托书子表
  const changelListGridModelInfo = viewModel.get("SY01_supply_apply_proList"); //适用产品
  viewModel.on("modeChange", function (data) {
    if (data == "edit" || data == "browse") {
      let orgId = viewModel.get("org_id").getValue();
      let sId = viewModel.get("supplierCode").getValue();
      let supplier_code = viewModel.get("supplierCode_code").getValue();
      let supplierName = viewModel.get("supplierName").getValue();
      var promise = new cb.promise();
      let sqwtsRows = licenseFwGridModelInfo.getRows();
      if (sqwtsRows.length > 0) {
        for (let i = 0; i < sqwtsRows.length; i++) {
          licenseFwGridModelInfo.setCellValue(i, "supplierCode", supplier_code);
          licenseFwGridModelInfo.setCellValue(i, "supplierName", supplierName);
          let sqwtsId = sqwtsRows[i].authorizerCode;
          cb.rest.invokeFunction(
            "ISY_2.public.getSunInfoList",
            {
              orgId: orgId,
              authLicenceId: sqwtsId,
              url: "ISY_2.ISY_2.SY01_personal_licensen",
              childUrl: "ISY_2.ISY_2.SY01_personal_licensen_child",
              upOrderId: "yourIdHere",
              type: "授权委托书"
            },
            function (err, res) {
              if (typeof res != "undefined") {
                let sqwtsRes = res.licenceRes;
                if (sqwtsRes.length > 0) {
                  let authType = sqwtsRes[0].licenceChildRes[0].authType;
                  licenseFwGridModelInfo.setCellValue(i, "item397ad", sqwtsRes[i].effectiveDate);
                  licenseFwGridModelInfo.setCellValue(i, "item683hi", sqwtsRes[i].validUntil);
                  licenseFwGridModelInfo.setCellValue(i, "item821bj", sqwtsRes[i].idCard);
                  licenseFwGridModelInfo.setCellValue(i, "item179zk", authType);
                  promise.resolve();
                }
                console.log(sqwtsRes);
              } else if (typeof err != "undefined") {
                console.log(err);
                promise.reject();
              }
            }
          );
        }
      }
      let licenceRows = licenseGridModelInfo.getRows();
      if (licenceRows.length > 0) {
        for (let i = 0; i < licenceRows.length; i++) {
          licenseGridModelInfo.setCellValue(i, "supplierCode", supplier_code);
          licenseGridModelInfo.setCellValue(i, "supplierName", supplierName);
          let licenceId = licenceRows[i].licenseId;
          cb.rest.invokeFunction(
            "ISY_2.public.getSunInfoList",
            {
              orgId: orgId,
              sId: sId,
              authLicenceId: licenceId,
              url: "ISY_2.ISY_2.SY01_supply_qualify_licence",
              childUrl: "ISY_2.ISY_2.SY01_supply_licence_child",
              upOrderId: "yourIdHere",
              type: "证照"
            },
            function (err, res) {
              if (typeof res != "undefined") {
                let licenceRes = res.licenceRes;
                console.log(res);
                if (licenceRes.length > 0) {
                  let authType = licenceRes[0].licenceChildRes[0].authType;
                  licenseGridModelInfo.setCellValue(i, "item314ee", authType);
                  promise.resolve();
                }
                console.log(licenceRes);
              } else if (typeof err != "undefined") {
                console.log(err);
                promise.reject();
              }
            }
          );
        }
        return promise;
      }
    }
  });
  // 相关证照授权范围切换时，删除孙表,将列换成对应的参照
  licenseGridModelInfo.on("afterCellValueChange", function (data) {
    if (data.cellName == "item314ee" && data.value != data.oldValue) {
      scopeGridModelInfo.deleteAllRows();
      switchDisplayFields(scopeGridModelInfo, data.value - 1);
    }
  });
  //初始化时参照查询值
  scopeGridModelInfo.on("beforeSetDataSource", function (data) {
    let sqType = licenseGridModelInfo.getCellValue(licenseGridModelInfo.getFocusedRowIndex(), "item314ee");
    switchDisplayFields(scopeGridModelInfo, sqType - 1);
  });
  //授权委托书
  licenseFwGridModelInfo.on("afterCellValueChange", function (data) {
    if (data.cellName == "item179zk" && data.oldValue != data.value) {
      //清空范围
      scopeFwGridModelInfo.deleteAllRows();
      switchDisplayFields(scopeFwGridModelInfo, data.value - 1);
    }
  });
  //初始化时参照查询值
  scopeFwGridModelInfo.on("beforeSetDataSource", function (data) {
    let sqType = licenseFwGridModelInfo.getCellValue(licenseFwGridModelInfo.getFocusedRowIndex(), "item179zk");
    switchDisplayFields(scopeFwGridModelInfo, sqType - 1);
  });
  viewModel.get("btnAddRowSY01_supply_licences_range").on("click", function (data) {
    const indexCell = licenseGridModelInfo.getFocusedRowIndex();
    let item314ee = viewModel.get("item314ee").getValue(); //供应商编码
    licenseGridModelInfo.setCellValue(indexCell, "authType", item314ee);
  });
  viewModel.get("btnAddRowSY01_supply_attorney_range").on("click", function (data) {
    const indexCell = licenseGridModelInfo.getFocusedRowIndex();
    let item179zk = viewModel.get("item179zk").getValue(); //供应商编码
    licenseGridModelInfo.setCellValue(indexCell, "authType", item179zk);
  });
  switchDisplayFields = function (gridModel, number) {
    let fields = ["authProduct_name", "authProductType_catagoryname", "authDosageForm_dosagaFormName", "authSku_name", "item1013ja", "item903zh"];
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
      gridModel.setColumnState(fields[i], "bCanModify", false);
    }
    switch (number) {
      case 0:
        gridModel.setColumnState("authProduct_name", "visible", true);
        gridModel.setColumnState("authProduct_name", "bCanModify", true);
        gridModel.setColumnState("item1013ja", "visible", true);
        gridModel.setColumnState("item1013ja", "bCanModify", false);
        break;
      case 1:
        gridModel.setColumnState("authProductType_catagoryname", "visible", true);
        gridModel.setColumnState("authProductType_catagoryname", "bCanModify", true);
        break;
      case 2:
        gridModel.setColumnState("authDosageForm_dosagaFormName", "visible", true);
        gridModel.setColumnState("authDosageForm_dosagaFormName", "bCanModify", true);
        break;
      case 3:
        gridModel.setColumnState("authSku_name", "visible", true);
        gridModel.setColumnState("authSku_name", "bCanModify", true);
        gridModel.setColumnState("item903zh", "visible", true);
        gridModel.setColumnState("item903zh", "bCanModify", false);
        gridModel.setColumnState("authProduct_name", "visible", true);
        gridModel.setColumnState("authProduct_name", "bCanModify", true);
        gridModel.setColumnState("item1013ja", "visible", true);
        gridModel.setColumnState("item1013ja", "bCanModify", false);
        break;
    }
  };
  //跳转页面
  viewModel.get("button46kc").on("click", function () {
    let id = viewModel.get("id").getValue();
    let org_id = viewModel.get("org_id").getValue();
    let org_id_name = viewModel.get("org_id_name").getValue();
    let supplierCode_code = viewModel.get("supplierCode_code").getValue();
    let productCode_code = viewModel.get("productCode_code").getValue();
    let skuCode_code = viewModel.get("skuCode_code").getValue();
    let proCode_code = viewModel.get("proCode_code").getValue();
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "ab76d607",
        params: {
          mode: "add",
          relationId: id,
          org_id: org_id,
          org_id_name: org_id_name,
          supplierCode_code: supplierCode_code,
          productCode_code: productCode_code,
          skuCode_code: skuCode_code,
          proCode_code: proCode_code
        }
      },
      viewModel
    );
    viewModel.execute("refresh");
  });
  //组织过滤
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    debugger;
    let returnPromise = new cb.promise();
    selectParamOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].isMaterialPass == "1" || data[i].isProductPass == "1") {
              orgId.push(data[i].org_id);
            }
          }
        }
        let treeCondition = {
          isExtend: true,
          simpleVOs: []
        };
        if (orgId.length > 0) {
          treeCondition.simpleVOs.push({
            field: "id",
            op: "in",
            value1: orgId
          });
        }
        this.setTreeFilter(treeCondition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  let selectParamOrg = function () {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("ISY_2.public.getParamInfo", {}, function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let paramRres = res.paramRes;
          resolve(paramRres);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
};