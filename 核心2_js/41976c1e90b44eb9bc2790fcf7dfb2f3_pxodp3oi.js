viewModel.on("afterLoadData", function (data) {
  var gridModel = viewModel.getGridModel("ReceiveBill_b");
  let rows = gridModel.getRows();
  let piArray = [];
  for (var i in rows) {
    let rowData = rows[i];
    let oriSum = rowData.oriSum;
    let rowDataStr = JSON.stringify(rowData);
    rowDataStr = rowDataStr.replace(/!/g, "_");
    let rowDataTemp = JSON.parse(rowDataStr);
    let cwPI = rowDataTemp.bodyItem_define1;
    let cwPIName = rowDataTemp.bodyItem_define1_name;
    let supplier = rowData.customer;
    let supplierName = rowData.customer_name;
    let isExist = false;
    if (!cwPI || !supplier) {
      continue;
    }
    for (var j in piArray) {
      let piObj = piArray[j];
      if (piObj.cwPI == cwPI && piObj.supplier == supplier) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      piArray.push({ cwPI: cwPI, supplier: supplier });
    }
  }
  let rst = cb.rest.invokeFunction("GT3734AT5.APIFunc.calReceiptPayApi", { ReceiptPay: "Receipt", PIs: JSON.stringify(piArray) }, function (err, res) {}, viewModel, { async: false });
  let rstObj = rst.result;
  if (rstObj.rst) {
    let piList = rstObj.piArray;
    for (var i in rows) {
      let rowData = rows[i];
      let rowDataStr = JSON.stringify(rowData);
      rowDataStr = rowDataStr.replace(/!/g, "_");
      let rowDataTemp = JSON.parse(rowDataStr);
      let cwPI = rowDataTemp.bodyItem_define1;
      let supplier = rowData.customer;
      for (var j in piList) {
        let piObj = piList[j];
        if (piObj.cwPI == cwPI && piObj.supplier == supplier) {
          rowData.item359vi = piObj.payAmount;
          rowData.item376ne = piObj.noAmount; //未收金额
          rowData.item343hg = piObj.sumAmount;
          gridModel.updateRow(i, rowData);
          break;
        }
      }
    }
  } else {
    cb.utils.alert("温馨提示！" + rstObj.msg, "error");
  }
  let id = viewModel.get("id").getValue();
  if (id) {
    let rest = cb.rest.invokeFunction("CM.self.getRelateWbApi", { id: id }, function (err, res) {}, viewModel, { async: false });
    if (rest.result.rst) {
      let rstData = rest.result.data;
      let wbBillCode = rstData.wbBillCode;
      viewModel.get("extendWbdh").setValue(wbBillCode);
    }
  }
  //部门是否与销售组织匹配
  debugger;
  chkSaleDept();
});
const chkSaleDept = () => {
  let org = viewModel.get("org").getValue();
  let org_name = viewModel.get("org_name").getValue();
  let dept_name = viewModel.get("dept_name").getValue();
  let dept = viewModel.get("dept").getValue();
  let operator_name = viewModel.get("operator_name").getValue();
  let operator = viewModel.get("operator").getValue();
  if (!org || !dept || !operator) {
    return;
  }
  let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getCWDeptApi", { org: org, dept: dept, operator: operator, deptname: dept_name }, function (err, res) {}, viewModel, { async: false });
  if (!rest.result.rst) {
    //不一致
    let verifystate = viewModel.get("verifystate").getValue();
    if (rest.result.deptId && verifystate != 2) {
      //未审核状态
      viewModel.get("dept_name").setValue(rest.result.deptName);
      viewModel.get("dept").setValue(rest.result.deptId);
      if (viewModel.get("item539nd")) {
        viewModel.get("item539nd").setValue(rest.result.deptCode);
      }
      if (viewModel.get("item391lj")) {
        viewModel.get("item391lj").setValue(rest.result.deptCode);
      }
    } else {
      cb.utils.alert("友情提示！" + rest.result.msg, "error");
    }
  } else {
    let verifystate = viewModel.get("verifystate").getValue();
    if (rest.result.deptId && verifystate != 2) {
      //未审核状态
      viewModel.get("dept_name").setValue(rest.result.deptName);
      viewModel.get("dept").setValue(rest.result.deptId);
      if (viewModel.get("item539nd")) {
        viewModel.get("item539nd").setValue(rest.result.deptCode);
      }
      if (viewModel.get("item391lj")) {
        viewModel.get("item391lj").setValue(rest.result.deptCode);
      }
    } else {
    }
  }
};
viewModel.get("ReceiveBill_b") &&
  viewModel.get("ReceiveBill_b").on("afterCellValueChange", function (data) {
    let gridModel = viewModel.get("ReceiveBill_b");
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    let rowData = viewModel.get("ReceiveBill_b").getRows()[rowIndex];
    if (cellName == "bodyItem!define1_name" || cellName == "customer_name") {
      let rowDataStr = JSON.stringify(rowData);
      rowDataStr = rowDataStr.replace(/!/g, "_");
      let rowDataTemp = JSON.parse(rowDataStr);
      let cwPI = rowDataTemp.bodyItem_define1;
      let supplier = rowData.customer;
      if (!cwPI || !supplier) {
        rowData.item359vi = 0;
        rowData.item376ne = 0; //未付金额
        rowData.item343hg = 0;
      }
      let rst = cb.rest.invokeFunction("GT3734AT5.APIFunc.calReceiptPayApi", { ReceiptPay: "Receipt", PIs: JSON.stringify([{ cwPI: cwPI, supplier: supplier }]) }, function (err, res) {}, viewModel, {
        async: false
      });
      let rstObj = rst.result;
      if (rstObj.rst) {
        let piList = rstObj.piArray;
        let piObj = piList[0];
        rowData.item359vi = piObj.payAmount;
        rowData.item376ne = piObj.noAmount; //未付金额
        rowData.item343hg = piObj.sumAmount;
        gridModel.updateRow(rowIndex, rowData);
      } else {
        cb.utils.alert("温馨提示！" + rstObj.msg, "error");
      }
    }
  });
viewModel.get("ReceiveBill_b") &&
  viewModel.get("ReceiveBill_b").on("beforeDblClick", function (data) {
    // 明细具体信息数据区--行双击前执行
    debugger;
  });
viewModel.getGridModel("ReceiveBill_b").on("afterDblClick", function (args) {
  debugger;
});
viewModel.get("org_name") &&
  viewModel.get("org_name").on("afterValueChange", function (data) {
    //销售组织--值改变后
    chkSaleDept();
  });
viewModel.get("dept_name") &&
  viewModel.get("dept_name").on("afterValueChange", function (data) {
    chkSaleDept();
  });
viewModel.get("operator_name") &&
  viewModel.get("operator_name").on("afterValueChange", function (data) {
    chkSaleDept();
  });