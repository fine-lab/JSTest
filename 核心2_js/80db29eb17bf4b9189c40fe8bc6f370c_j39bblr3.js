// 这个地方初始化遗留取消遗留按钮
viewModel.on("afterMount", (data) => {
  let gridModel = viewModel.getGridModel();
  //获取列表所有数据
  const rows = gridModel.getRows();
  //从缓存区获取按钮
  const actions = gridModel.getCache("actions");
  if (!actions) return;
  viewModel.get("btnSubmit").setVisible(false);
  if (!viewModel.get("isWfControlled").getValue()) {
    // 这个地方显示审核按钮
    viewModel.get("button174zi").setVisible(false);
    viewModel.get("button291re").setVisible(false);
    viewModel.get("button229ag").setVisible(false);
    if (viewModel.get("approvalStatus").getValue() === "1" || viewModel.get("approvalStatus").getValue() === "4") {
      viewModel.get("button76ph").setVisible(true);
      viewModel.get("button102eb").setVisible(false);
      viewModel.get("btnDelete").setVisible(true);
      viewModel.get("button204kc").setVisible(true);
    } else {
      viewModel.get("button76ph").setVisible(false);
      viewModel.get("btnDelete").setVisible(false);
      viewModel.get("button102eb").setVisible(true);
      viewModel.get("button204kc").setVisible(false);
    }
  } else {
    // 这个地方显示提交,审批按钮
    viewModel.get("button76ph").setVisible(false);
    viewModel.get("button102eb").setVisible(false);
    if (viewModel.get("approvalStatus").getValue() === "1") {
      viewModel.get("button204kc").setVisible(true);
      viewModel.get("button174zi").setVisible(false);
      viewModel.get("button291re").setVisible(false);
      viewModel.get("button229ag").setVisible(true);
      viewModel.get("btnDelete").setVisible(true);
      viewModel.get("button27vg").setVisible(true);
      viewModel.get("button35ug").setVisible(true);
    } else if (viewModel.get("approvalStatus").getValue() === "4" && viewModel.get("verifystate").getValue() === 0) {
      viewModel.get("button204kc").setVisible(true);
      viewModel.get("button174zi").setVisible(false);
      viewModel.get("button291re").setVisible(false);
      viewModel.get("button229ag").setVisible(true);
      viewModel.get("btnDelete").setVisible(true);
      viewModel.get("button27vg").setVisible(true);
      viewModel.get("button35ug").setVisible(true);
    } else if (viewModel.get("approvalStatus").getValue() === "4" && viewModel.get("verifystate").getValue() === 1) {
      viewModel.get("button204kc").setVisible(true);
      viewModel.get("button174zi").setVisible(false);
      viewModel.get("button291re").setVisible(true);
      viewModel.get("button229ag").setVisible(false);
      viewModel.get("btnDelete").setVisible(true);
      viewModel.get("button27vg").setVisible(true);
      viewModel.get("button35ug").setVisible(true);
    } else if (viewModel.get("approvalStatus").getValue() === "2") {
      viewModel.get("button102eb").setVisible(false);
      viewModel.get("button204kc").setVisible(false);
      viewModel.get("button174zi").setVisible(true);
      viewModel.get("button291re").setVisible(true);
      viewModel.get("button229ag").setVisible(false);
      viewModel.get("btnDelete").setVisible(false);
      viewModel.get("button27vg").setVisible(false);
      viewModel.get("button35ug").setVisible(false);
    } else if (viewModel.get("approvalStatus").getValue() === "3") {
      viewModel.get("button102eb").setVisible(false);
      viewModel.get("button204kc").setVisible(false);
      viewModel.get("button174zi").setVisible(true);
      viewModel.get("button291re").setVisible(false);
      viewModel.get("button229ag").setVisible(false);
      viewModel.get("btnDelete").setVisible(false);
      viewModel.get("button27vg").setVisible(false);
      viewModel.get("button35ug").setVisible(false);
    }
  }
  let approvalStatus = viewModel.get("approvalStatus").getValue();
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      //设置按钮可用不可用
      if (approvalStatus === "1" || approvalStatus === "4") {
        actionState["button27vg"] = { visible: true };
        actionState["button35ug"] = { visible: true };
      } else {
        actionState["button27vg"] = { visible: false };
        actionState["button35ug"] = { visible: false };
      }
    });
    actionsStates.push(actionState);
  });
  gridModel.setActionsState(actionsStates);
});
viewModel.on("afterLoadData", (args) => {
  let datas = viewModel.getParams().datas;
  if (viewModel.getParams().mode == "add" && datas && datas.length !== 0 && (!args || !args.id)) {
    viewModel.getParams().query.busiObj = undefined;
    viewModel.get("button174zi").setVisible(false);
    viewModel.get("button57xi").setVisible(false);
    viewModel.get("button76ph").setVisible(false);
    viewModel.get("button291re").setVisible(false);
    viewModel.get("button204kc").setVisible(false);
    viewModel.get("checkbillNo").setData(args.code);
    if (datas.vouchdate) {
      viewModel.get("checkbillStartdate").setValue(datas.vouchdate.value1);
      viewModel.get("checkbillDeadline").setValue(datas.vouchdate.value2);
    }
    viewModel.get("billsDate").setValue(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate());
    viewModel.get("checkbillStatus").setData("1");
    viewModel.get("source_id").setData(datas.id);
    viewModel.get("source_id").setVisible(false);
    viewModel.get("currency").setData(datas.currency);
    viewModel.get("currency_name").setData(datas.currency_name);
    viewModel.get("checkbillTitle").setData(datas.title);
    viewModel.get("checkbillCustomer_name").setData(datas.cust_name);
    viewModel.get("checkbillCustomer").setValue({ id: datas.cust, checkbillCustomer: datas.cust_name });
    viewModel.get("checkbillCustomer").setValue({ id: datas.cust, checkbillCustomer: datas.cust_name });
    setData(datas.selectedRows);
  } else {
    viewModel.execute("afterMount");
  }
});
viewModel.getGridModel().on("afterCellValueChange", function (event) {
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  cb.cache.set("cellName", event.cellName);
  // 调整含税单价
  if (
    event.cellName === "adjustInTaxUnitprice" ||
    event.cellName === "purchaseDeductInTaxAmount" ||
    event.cellName === "adjustFreetaxUnitprice" ||
    event.cellName === "adjustTaxRate" ||
    event.cellName === "purchaseDeductInTaxAmount" ||
    event.cellName === "purchaseDeductFreetaxAmount"
  ) {
    changeNum(viewModel);
  }
});
viewModel.get("button35ug") &&
  viewModel.get("button35ug").on("click", function (data) {
    // 遗留--单击
    let gridModel = viewModel.getGridModel();
    let rowData = gridModel.getRow(data.index);
    gridModel.setCellValue(data.index, "isLeave", 1);
    gridModel.setCellValue(data.index, "checkbillStatus", "3");
    changeNum(viewModel);
    let data11 = viewModel.getAllData();
    let HXSaCheckMaterialVO2List = [];
    data11.HXSaCheckMaterialVO2List.map((item) => {
      HXSaCheckMaterialVO2List.push({
        id: item.id,
        isLeave: item.isLeave.toString(),
        checkbillStatus: item.checkbillStatus.toString(),
        _status: "Update"
      });
    });
    var objectList = {
      id: data11.id,
      totalLegacyNum: data11.totalLegacyNum,
      totalRealVerifyNum: data11.totalRealVerifyNum,
      totalLegacyInTaxAmount: data11.totalLegacyInTaxAmount,
      totalRealVerifyInTaxAmount: data11.totalRealVerifyInTaxAmount,
      HXSaCheckMaterialVO2List
    };
    cb.rest.invokeFunction("AT16F3BEFC09B8000B.backOpenApiFunction.HX1678799714", { objectList }, function (err, res) {});
  });
viewModel.get("button27vg") &&
  viewModel.get("button27vg").on("click", function (data) {
    // 取消遗留--单击
    let gridModel = viewModel.getGridModel();
    let rowData = gridModel.getRow(data.index);
    gridModel.setCellValue(data.index, "isLeave", 0);
    gridModel.setCellValue(data.index, "checkbillStatus", "2");
    changeNum(viewModel);
    let data12 = viewModel.getAllData();
    let HXSaCheckMaterialVO2List = [];
    data12.HXSaCheckMaterialVO2List.map((item) => {
      HXSaCheckMaterialVO2List.push({
        id: item.id,
        isLeave: item.isLeave.toString(),
        checkbillStatus: item.checkbillStatus.toString(),
        _status: "Update"
      });
    });
    var objectList = {
      id: data12.id,
      totalLegacyNum: data12.totalLegacyNum,
      totalRealVerifyNum: data12.totalRealVerifyNum,
      totalLegacyInTaxAmount: data12.totalLegacyInTaxAmount,
      totalRealVerifyInTaxAmount: data12.totalRealVerifyInTaxAmount,
      HXSaCheckMaterialVO2List
    };
    cb.rest.invokeFunction("AT16F3BEFC09B8000B.backOpenApiFunction.HX1678799714", { objectList }, function (err, res) {});
  });
function changeNum(viewModel) {
  let allRowsData = viewModel.getGridModel().getAllData();
  let cellName = cb.cache.get("cellName");
  let totalLegacyNum = 0;
  let totalRealVerifyNum = 0;
  let totalNum = 0;
  let totalShouldVerifyInTaxAmount = 0;
  let totalRealVerifyInTaxAmount = 0;
  let totalLegacyInTaxAmount = 0;
  let totalDeductInTaxAmount = 0;
  allRowsData.map((item, index) => {
    //总数量
    totalNum += item.ShouldVerifyNum;
    //调整的是无税单价
    if (cellName == "adjustFreetaxUnitprice") {
      //含税单价 = (1 + 税率) * 无税单价
      item.adjustInTaxUnitprice = (1 + item.adjustTaxRate * 0.01) * item.adjustFreetaxUnitprice;
      viewModel.getGridModel().setCellValue(index, "adjustInTaxUnitprice", item.adjustInTaxUnitprice);
    }
    //应对含税金额 = 数量 * 含税单价
    item.ShouldVerifyInTaxAmount = item.ShouldVerifyNum * item.adjustInTaxUnitprice;
    viewModel.getGridModel().setCellValue(index, "ShouldVerifyInTaxAmount", item.ShouldVerifyInTaxAmount);
    //应对税额 = 含税金额 ÷（1＋税率）× 税率
    item.ShouldVerifyTax = (item.ShouldVerifyInTaxAmount / (1 + item.adjustTaxRate * 0.01)) * item.adjustTaxRate * 0.01;
    viewModel.getGridModel().setCellValue(index, "ShouldVerifyTax", item.ShouldVerifyTax);
    //实对无税金额 ＝ 含税金额 － 税额
    item.RealVerifyFreetaxAmount = item.ShouldVerifyNum * item.adjustInTaxUnitprice - item.ShouldVerifyTax;
    viewModel.getGridModel().setCellValue(index, "RealVerifyFreetaxAmount", item.RealVerifyFreetaxAmount);
    //实对含税金额
    item.RealVerifyInTaxAmount = item.ShouldVerifyNum * item.adjustInTaxUnitprice + item.purchaseDeductInTaxAmount;
    viewModel.getGridModel().setCellValue(index, "RealVerifyInTaxAmount", item.RealVerifyInTaxAmount);
    //调整的是税率
    if (cellName == "adjustTaxRate") {
      //无税单价=无税金额/数量
      item.adjustFreetaxUnitprice = item.RealVerifyFreetaxAmount / item.ShouldVerifyNum;
      viewModel.getGridModel().setCellValue(index, "adjustFreetaxUnitprice", item.adjustFreetaxUnitprice);
      item.purchaseDeductFreetaxAmount = item.purchaseDeductInTaxAmount - (item.purchaseDeductInTaxAmount / (1 + item.adjustTaxRate * 0.01)) * item.adjustTaxRate * 0.01;
      viewModel.getGridModel().setCellValue(index, "purchaseDeductFreetaxAmount", item.purchaseDeductFreetaxAmount);
    }
    //调整的是含税单价，
    if (cellName == "adjustInTaxUnitprice") {
      //无税单价=无税金额/数量
      item.adjustFreetaxUnitprice = item.RealVerifyFreetaxAmount / item.ShouldVerifyNum;
      viewModel.getGridModel().setCellValue(index, "adjustFreetaxUnitprice", item.adjustFreetaxUnitprice);
    }
    //调整的是销售扣款含税金额，销售扣款无税金额 = 销售扣款含税金额 － 税额
    if (cellName == "purchaseDeductInTaxAmount") {
      item.purchaseDeductFreetaxAmount = item.purchaseDeductInTaxAmount - (item.purchaseDeductInTaxAmount / (1 + item.adjustTaxRate * 0.01)) * item.adjustTaxRate * 0.01;
      viewModel.getGridModel().setCellValue(index, "purchaseDeductFreetaxAmount", item.purchaseDeductFreetaxAmount);
    }
    //调整的是销售扣款无税金额，(1 + 税率) * 销售扣款无税金额
    if (cellName == "purchaseDeductFreetaxAmount") {
      item.purchaseDeductInTaxAmount = (1 + item.adjustTaxRate * 0.01) * item.purchaseDeductFreetaxAmount;
      viewModel.getGridModel().setCellValue(index, "purchaseDeductInTaxAmount", item.purchaseDeductInTaxAmount);
    }
    //总应对含税
    totalShouldVerifyInTaxAmount += item.ShouldVerifyInTaxAmount;
    if (item.isLeave === 1) {
      //总遗留 = 遗留状态的 “应对数量” 相加
      totalLegacyNum += item.ShouldVerifyNum;
      //总遗留含税金额
      totalLegacyInTaxAmount += item.ShouldVerifyInTaxAmount;
    }
    //总扣款含税金额
    if (item.purchaseDeductInTaxAmount && item.purchaseDeductInTaxAmount != NaN && item.isLeave != 1) {
      totalDeductInTaxAmount += item.purchaseDeductInTaxAmount;
    }
  });
  //总实对数量
  totalRealVerifyNum = totalNum - totalLegacyNum < 0 ? 0 : totalNum - totalLegacyNum;
  //总实对含税金额
  totalRealVerifyInTaxAmount = totalShouldVerifyInTaxAmount - totalLegacyInTaxAmount + totalDeductInTaxAmount < 0 ? 0 : totalShouldVerifyInTaxAmount - totalLegacyInTaxAmount + totalDeductInTaxAmount;
  //数据回写
  viewModel.get("totalNum").setData(totalNum);
  viewModel.get("totalLegacyNum").setData(totalLegacyNum);
  viewModel.get("totalRealVerifyNum").setData(totalRealVerifyNum);
  viewModel.get("totalShouldVerifyInTaxAmount").setData(totalShouldVerifyInTaxAmount);
  viewModel.get("totalLegacyInTaxAmount").setData(totalLegacyInTaxAmount);
  viewModel.get("totalRealVerifyInTaxAmount").setData(totalRealVerifyInTaxAmount);
  viewModel.get("totalDeductInTaxAmount").setData(totalDeductInTaxAmount);
}
function setData(data) {
  let data2 = [];
  var grid = viewModel.getGridModel();
  let queryArrivalParams = [];
  data.map((item) => {
    let queryArrivalParam = {};
    queryArrivalParam.deliveryCode = item.code;
    queryArrivalParam.purchaseOrderNo = item.details_orderCode;
    queryArrivalParam.details_uplineno = item.details_uplineno;
    queryArrivalParams.push(queryArrivalParam);
  });
  let Arrivalresult = cb.rest.invokeFunction("AT16F3BEFC09B8000B.backOpenApiFunction.HX1678179385", { queryArrivalParams }, function (err, res) {}, viewModel, { domainKey: "upu", async: false });
  data.map((item) => {
    let line2 = {
      isLeave: false,
      projectCode_code: item.details_project_code,
      projectCode: item.details_project,
      projectName_name: item.details_project_name,
      projectName: item.details_project,
      confirmStatus: 1,
      originBillsType_name: "销售出库单",
      originBillsType: "HSFWYSGLYY7",
      originBillsNo: item.code,
      originBillsDate: item.createDate.split(" ")[0],
      purchasingOrganization_name: item.salesOrg_name,
      purchasingOrganization: item.salesOrg,
      warehouseName_name: item.warehouse_name,
      warehouseName: item.warehouse,
      materialCode_code: item.details_productn_code,
      materialCode: item.details_productn,
      materialName_name: item.details_productn_name,
      materialName: item.details_productn,
      specification: item.details_productn_modelDescription,
      unitsName: item.details_priceUOM,
      unitsName_name: item.details_priceUOM_name,
      ShouldVerifyNum: item.details_qty,
      ShouldVerifyInTaxAmount: item.details_oriSum,
      ShouldVerifyTax: item.details_oriTax,
      oldFreetaxUnitprice: item.details_oriUnitPrice,
      oldInTaxUnitprice: item.details_oriTaxUnitPrice,
      oldTaxRate: item.details_taxRate,
      adjustInTaxUnitprice: item.details_oriTaxUnitPrice,
      adjustFreetaxUnitprice: item.details_oriUnitPrice,
      adjustTaxRate: item.details_taxRate,
      //销售扣款含税金额
      //销售扣款无税金额
      RealVerifyFreetaxAmount: item.details_oriUnitPrice,
      RealVerifyInTaxAmount: item.details_oriTaxUnitPrice,
      purchaseOrderNo: item.details_orderCode,
      originBillsLineNo: item.details_lineno,
      currencyName: item.currency,
      currencyName_name: item.currency_name,
      sourceTableheadRemarks: "",
      sourceTablebodyRemarks: "",
      remarks: item.memo,
      checkbillStatus: "2",
      originBillsLineMainId: item.id,
      originBillsLineId: item.details_id,
      sourcechild_id: item.details_id,
      source_id: item.id,
      hxjiaoyileixing: item.bustype === "1684474525690363906" ? "一般贸易" : "甲供贸易"
    };
    Arrivalresult.result.res.map((item2) => {
      if (item2.salesoutCode === item.code) {
        line2.arrivalBillsNo = item2.code;
        line2.receiptTime = item2.auditTime ? item2.auditTime : "";
      }
      item2.child.map((item3) => {
        if (item3.upLineno === item.details_lineno) {
          line2.quantityReceived = item3.acceptqty;
        }
      });
    });
    grid.appendRow(line2);
  });
  changeNum(viewModel);
}
viewModel.get("btnAbandonBrowst") &&
  viewModel.get("btnAbandonBrowst").on("click", function (data) {
    //返回--单击
    const data2 = {
      billtype: "voucherlist", //列表用voucherlist，还有FreeView等
      billno: "yb5d450a1fList" //具体的billno
    };
    cb.loader.runCommandLine("bill", data2, viewModel);
  });
viewModel.on("afterSave", function (args) {
  viewModel.execute("refresh");
});
//审核按钮
viewModel.on("afterAudit", function (args) {
  debugger;
  viewModel.execute("refresh");
});
//弃审按钮
viewModel.on("afterUnaudit", function (args) {
  debugger;
  viewModel.execute("refresh");
});
//提交按钮
viewModel.on("afterSubmit", function (args) {
  debugger;
  viewModel.execute("refresh");
});
viewModel.on("afterUnsubmit", function (args) {
  debugger;
  viewModel.execute("refresh");
});
viewModel.on("afterWorkflowBeforeQueryAsync", function (args) {
  debugger;
  viewModel.execute("refresh");
});
viewModel.on("afterWorkflow", function (args) {
  debugger;
  viewModel.execute("refresh");
});
//点击发送签章
viewModel.get("button321ki") &&
  viewModel.get("button321ki").on("click", function (data) {
    //发送签章--单击
    let viewModel = cb.cache.get("viewModel");
    let yhtAccessToken = cb.context.getYhtAccessToken();
    getDownLoadUrl(yhtAccessToken);
  });
function getDownLoadUrl(yhtAccessToken) {
  var data =
    "appSource=developplatform&domainDataBaseByCode=SCMSD&tenantId=j39bblr3&meta=1&sendType=6&lang=zh_CN&yht_access_token=" +
    yhtAccessToken +
    "&printcode=u8c1678183170000&domainKey=developplatform&serverUrl=https%3A%2F%2Fc2.yonyoucloud.com%2Fmdf-node%2Funiform%2Fprint%2FgetTemplateContent%3FdomainKey%3Ddevelopplatform&params=%7B%22billno%22%3A%22yb5d450a1f%22%2C%22printcountswitch%22%3Atrue%2C%22printrefreshinterval%22%3A1000%2C%22ids%22%3A%5B%221753335555954311169%22%5D%7D&previewUrl=https%3A%2F%2Fc2.yonyoucloud.com%2Fiuap-apcom-print%2Fu8cprint%2Fdesign%2FgetPreview&cookie=locale%3Dzh_CN%3B_WorkbenchCross_%3DUltraman%3Bat%3D73a86695-9f14-4115-a301-585cf0393a86%3BJSESSIONID%3D2484EA1CB7855EDDB58A196A63123135%3Byht_username_diwork%3DST-130617-K5dMXDmVbIDfYEKgiFHE-online__8efdb18f-95a3-4087-91b1-da0a86d092fa%3Byht_usertoken_diwork%3DVTw%252FRxsq1g3Hf4J0RbMtO8kjNUQU6j48x781YHsF3CsOZIHN0XgPjmsL7U%252F6eu4j3h0AP5HHIMmKwvEcyuEGSQ%253D%253D%3Byht_access_token%3DbttcnF6TDUvL1hIQzIyZXBtTTlFSEZyU2Ixem9ZZlBEdFluVzNUbFR2QWFnZGZyQVJsMGoxQStBTWhQajR0ZmtsZV9fZXVjLnlvbnlvdWNsb3VkLmNvbQ..__894682e90f946ef1402331f759ea28e3_1687315237778dccore0iuap-apcom-workbenchaccf2030YT%3BmultilingualFlag%3Dtrue%3Btimezone%3DUTC%2B08%3A00%3Blanguage%3D001%3Blocale%3Dzh_CN%3BorgId%3D%3BdefaultOrg%3D%3Btenantid%3Dj39bblr3%3Btheme%3D%3Blanguages%3D001001002003%3BnewArch%3Dfalse%3Bsysid%3Ddiwork%3Ba00%3DYzJoRi4tcNhDR3dFchHdKhSlaF8_Oz7E8ZJlTF8fCuBqMzliYmxyM2AyOTk1MDQ3OTQ1MTE0MDE2YGozOWJibHIzYDhlZmRiMThmLTk1YTMtNDA4Ny05MWIxLWRhMGE4NmQwOTJmYWAxYGBlNmI1YjdlNWIzYTFlNWJiYmFlOGFlYmVlOWEyODZlNWFmYmNgYGAxNTcwMzQ2MTU1MDM4OTk4NTMxYGZhbHNlYGAxNjg3MzE1MjM3NzgwYHltc3NlczpiNzBiZTk3YzE5NDRhODhiYWRlYzIyYThiNTcyODFiOWBkaXdvcmtg%3Ba10%3DMDcxODE1NzI2MTc0OTEyMzc3ODA%3Bn_f_f%3Dfalse%3Bwb_at%3DLMjnpmsntjDrcFQ6lOaB6eR7Dfh8A7jnmkhmd%3Bc800%3Ddccore0%3BjDiowrkTokenMock%3DbttcnF6TDUvL1hIQzIyZXBtTTlFSEZyU2Ixem9ZZlBEdFluVzNUbFR2QWFnZGZyQVJsMGoxQStBTWhQajR0ZmtsZV9fZXVjLnlvbnlvdWNsb3VkLmNvbQ..__894682e90f946ef1402331f759ea28e3_1687315237778dccore0iuap-apcom-workbenchaccf2030YT%3BPHPSESSID%3Drmcscs29tgu26evkjh7bt4fvhr%3Bck_safe_chaoke_csrf_token%3D9cc53ad0dbca0629c1979b79e32f4d26%3BYKJ_IS_DIWORK%3D1%3BYKJ_DIWORK_DATA%3D%257B%2522data%2522%253A%257B%2522is_diwork%2522%253A1%252C%2522cur_qzid%2522%253A%2522578590%2522%257D%252C%2522key%2522%253A%2522560adc6dcf913bd3f2e0da21b144987f%2522%257D%3Bacw_tc%3D2760828d16873152760538015ecf4536531ac2c6d3359ea88559ef9802826d%3BXSRF-TOKEN%3DAX_67N9GTRLBPB27OT51SUWQATQ1%21104606%3B&split=false&keepAlive=true";
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("POST", "https://www.example.com/");
  xhr.setRequestHeader("authority", "c2.yonyoucloud.com");
  xhr.setRequestHeader("accept", "application/json, text/plain, */*");
  xhr.setRequestHeader("accept-language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
  xhr.send(data);
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      let fileId = JSON.parse(this.responseText).data;
      getFileUrl(fileId);
    }
  });
}
function getFileUrl(fileId) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("GET", "https://www.example.com/" + fileId + "&t=" + new Date().getTime().toString());
  xhr.setRequestHeader("authority", "c2.yonyoucloud.com");
  xhr.setRequestHeader("accept", "application/json, text/plain, */*");
  xhr.setRequestHeader("accept-language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
  xhr.send();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      debugger;
      console.log(this.responseText);
      let fileUrl = JSON.parse(this.responseText).data;
      downloadFile(fileUrl);
    }
  });
}
function downloadFile(fileUrl) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("GET", fileUrl, true);
  xhr.responseType = "blob";
  xhr.send();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      debugger;
      console.log(this.response);
      sendToApi(this.response);
    }
  });
}
function sendToApi(fileBlob) {
  cb.rest.invokeFunction("PU.backDesignerFunction.HX1687244342", { fileBlob }, function (err, res) {
    debugger;
  });
}