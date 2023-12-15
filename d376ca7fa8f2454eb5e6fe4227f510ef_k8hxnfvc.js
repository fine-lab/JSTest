viewModel.on("customInit", function (data) {
  // 采购需求申请变更单详情--页面初始化
});
cb.rest.invokeFunctionReq = function (id, data, callback, viewModel, options) {
  if (!options) {
    var options = {};
  }
  options.domainKey = "yourKeyHere";
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  return proxy.doProxy(data, callback);
};
viewModel.on("afterLoadData", function () {
  debugger;
  var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
  if (currentState == "add") {
    //新增状态
    let praybill = viewModel.getParams().praybill;
    if (praybill) {
      initnewbill(praybill);
    }
  }
});
function initnewbill(praybill) {
  viewModel.get("org_id").setValue(praybill.reqOrgId);
  viewModel.get("org_id_name").setValue(praybill.reqOrgName);
  viewModel.get("reqOrgId").setValue(praybill.reqOrgId);
  viewModel.get("reqOrgName").setValue(praybill.reqOrgName);
  viewModel.get("reqdeptId").setValue(praybill.reqdeptId);
  viewModel.get("reqdeptId_name").setValue(praybill.erpReqdeptName);
  viewModel.get("erpReqdeptId").setValue(praybill.reqdeptId);
  viewModel.get("erpReqdeptName").setValue(praybill.erpReqdeptName);
  viewModel.get("subject").setValue(praybill.subject);
  viewModel.get("vbillCode").setValue(praybill.vbillCode);
  viewModel.get("transactionTypeName").setValue(praybill.transactionTypeName);
  viewModel.get("transactionTypeCode").setValue(praybill.transactionTypeCode);
  viewModel.get("transactionTypeId").setValue(praybill.transactionTypeId);
  viewModel.get("commitDate").setValue(praybill.commitDate);
  viewModel.get("reqPurpose").setValue(praybill.reqPurpose);
  viewModel.get("reqBudgetMny").setValue(praybill.reqBudgetMny);
  viewModel.get("planTotalMny").setValue(praybill.planTotalMny);
  viewModel.get("source_id").setValue(praybill.id);
  viewModel.get("source_billtype").setValue("ycpraybill");
  let prayBillDetails = praybill.prayBillDetails;
  let detailList = [];
  for (var i = 0; i < prayBillDetails.length; i++) {
    let detail = {
      productDocId: prayBillDetails[0].productDocId,
      productCode: prayBillDetails[0].productCode,
      productName: prayBillDetails[0].productName,
      productDocId_name: prayBillDetails[0].productName,
      purchaseNum: prayBillDetails[0].purchaseNum,
      reqBudgetPrice: prayBillDetails[0].reqBudgetPrice,
      reqBudgetMny: prayBillDetails[0].reqBudgetMny,
      planPrice: prayBillDetails[0].planPrice,
      planMoney: prayBillDetails[0].planMoney,
      source_id: praybill.id,
      sourcechild_id: prayBillDetails[0].id,
      source_billtype: "ycpraybill"
    };
    viewModel.get("pur_praybill_b_change_billList").appendRow(detail);
  }
}
viewModel.on("beforeSave", function (data) {
  runAsync().then(function (data) {
    return false;
    //后面可以用传过来的数据做些其他操作
  });
  alert("3333");
});
function runAsync() {
  var p = new Promise(function (resolve, reject) {
    cb.utils.confirm(
      "第一次执行确认！",
      function () {
        resolve("Y");
      },
      function (args) {
        resolve("N");
      },
      "",
      "继续保存",
      "取消"
    );
  });
  return p;
}