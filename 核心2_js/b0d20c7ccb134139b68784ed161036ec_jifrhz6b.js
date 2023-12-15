viewModel.get("defines!define2_account") &&
  viewModel.get("defines!define2_account").on("beforeBrowse", function (data) {
    let supplierId = viewModel.get("supplierId").getValue();
    // 银行账号--参照弹窗打开前
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    if (viewModel.get("supplierId").getValue()) {
      //字段stopstatus等于0的数据进行查询
      condition.simpleVOs.push({
        field: "vendor.id",
        op: "eq",
        value1: supplierId
      });
    }
    this.setFilter(condition);
  });
viewModel.on("beforeSave", function (data) {
  const resJson = JSON.parse(data.data.data);
  //合同名称处理
  let subject = viewModel.get("subject").getValue();
  if (!subject) {
    let projectName = viewModel.get("projectName").getValue();
    projectName = projectName ? projectName : "";
    const materialData = viewModel.getGridModel().getAllData();
    let reqDeptName = materialData[0].reqDeptName ? materialData[0].reqDeptName : "";
    viewModel.get("subject").setValue(projectName + materialData[0].materialName + reqDeptName);
    resJson["subject"] = projectName + materialData[0].materialName + reqDeptName;
  }
  data.data.data = JSON.stringify(resJson);
});
cb.rest.invokeFunctionS = function (id, data, callback, viewModel, options) {
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
viewModel.on("afterLoadData", function (data) {
  debugger;
  //转换银行信息
  let supplierId = viewModel.get("supplierId").getValue();
  let define2 = viewModel.get("defines!define2").getValue();
  if (!define2 && supplierId) {
    cb.rest.invokeFunctionS("9bd1267f5ec4480d95b2cd20f8f8288a", { supplierId }, function (err, res) {
      if (res && res.result) {
        viewModel.get("defines!define2").setValue(res.result[0].id);
        viewModel.get("defines!define2_account").setValue(res.result[0].account);
        viewModel.get("defines!define3").setValue(res.result[0].accountname);
        let openaccountbank = res.result[0].openaccountbank;
        if (openaccountbank) {
          cb.rest.invokeFunctionS("17807d7cc2074fc7b55dfde3bda3732d", { openaccountbank }, function (err, res) {
            if (res && res.result) {
              viewModel.get("defines!define4").setValue(res.result[0].name);
            }
          });
        }
      }
    });
  }
  if (!data.signAddress) {
    viewModel.get("signAddress").setValue("贵阳");
  }
  //其他单据生成合同 携带信息填充
  var { reqDatas } = viewModel.getParams();
  if (reqDatas && reqDatas.length > 0) {
    reqDatas.forEach((item) => {
      let materialData = {
        materialId: item.productDocId,
        materialCode: item.productCode,
        materialName: item.productName,
        materialIdFile: item.productDocIdFile,
        spec: item.productSpec,
        model: item.productType,
        materialClassId: item.materialClassId,
        materialClassCode: item.materialClassCode,
        materialClassName: item.materialClassName,
        materialDesc: item.productDesc,
        purchaseNum: item.purchaseUnBusiNums,
        num: item.purchaseUnBusiNums,
        mainNum: item.purchaseUnBusiNums,
        purchaseUnitId: item.purchaseUnitId,
        purchaseUnitName: item.purchaseUnitName,
        firstBillcode: item.sourcecode,
        reqId: item.sourcecode
      };
      viewModel.getGridModel().appendRow(materialData);
    });
    viewModel.get("sourceType").setValue("6");
    let projectName = viewModel.get("projectName").getValue();
    projectName = projectName ? projectName + "-" : "";
    let deptName = viewModel.get("deptName").getValue();
    deptName = deptName ? "-" + deptName : "";
    viewModel.get("subject").setValue(projectName + reqDatas[0].productName + deptName);
  }
});