viewModel.on("customInit", function (data) {
  // 采购合同变更--页面初始化
  viewModel.on("afterLoadData", function () {});
  viewModel.on("modeChange", function (data) {
    debugger;
    viewModel.get("btnaddRow_1").setState("bHidden", true);
    viewModel.get("btnsourcebill_1").setState("bHidden", true);
    viewModel.get("btnimportRow_1").setState("bHidden", true);
    viewModel.get("btnBatchModify").setState("bHidden", true);
    viewModel.get("btndeleteRow_1").setState("bHidden", true);
  });
});
function confirmS(content) {
  cb.utils.confirm(
    content,
    function () {},
    function (args) {}
  );
}
viewModel.on("beforeSave", function (data) {
  let changeData = JSON.parse(data.data.data);
  let newMoney = changeData.taxMoney;
  let contractid = changeData.contractId;
  let conDetail = cb.rest.invokeFunction("ycContractManagement.interface.queryContract", { id: contractid }, function (err, res) {}, viewModel, { async: false });
  let oldMoney = conDetail.result.taxMoney;
  if (newMoney > oldMoney) {
    confirmS("合同变更金额不能大于原合同金额！");
    return false;
  }
});
viewModel.get("defines!define15_name") &&
  viewModel.get("defines!define15_name").on("beforeBrowse", function (data) {
    // 采购类别配置--参照弹窗打开前
    // 采购类别配置--参照弹窗打开前
    debugger;
    var transTypeCode = viewModel.get("transtypeCode").getValue();
    var simpleVOs = [
      {
        field: "purBillType",
        op: "eq",
        value1: "contract"
      },
      {
        field: "transTypeCode",
        op: "eq",
        value1: transTypeCode
      },
      {
        field: "enable",
        op: "eq",
        value1: 1
      }
    ];
    //主要代码
    var condition = {
      isExtend: true,
      simpleVOs: simpleVOs
    };
    //设置过滤条件
    this.setFilter(condition);
  });
viewModel.get("defines!define15_name") &&
  viewModel.get("defines!define15_name").on("afterValueChange", function (data) {
    debugger;
    // 采购类别配置--值改变后
    console.log("采购类别配置值改变后信息", data);
    var transTypeCode = viewModel.get("transtypeCode").getValue();
    if (data && data.value) {
      viewModel.get("defines!define1").setValue(data.value.purCategory);
      viewModel.get("defines!define1_name").setValue(data.value.purCategory_name);
      if (data.value.purCategory == "1570752768404094984" || data.value.purCategory == "1570753086231674885" || transTypeCode == "HT05") {
        viewModel.get("defines!define4").setValue("固定资产类采购合同");
      }
    }
  });
viewModel.get("defines!define8") &&
  viewModel.get("defines!define8").on("afterValueChange", function (data) {
    debugger;
    // 合同类型--值改变后
    if (data && data.value) {
      var code = data.value.code;
      if (code == "01") {
        //框架协议
        viewModel.get("billtype").setValue("1");
        viewModel.get("parentContractName").setVisible(false);
        viewModel.get("parentContractName").setState("bIsNull", true);
      } else if (code == "02") {
        viewModel.get("billtype").setValue("2");
        viewModel.get("parentContractName").setVisible(true);
        viewModel.get("parentContractName").setState("bIsNull", false);
      } else {
        viewModel.get("billtype").setValue("2");
        viewModel.get("parentContractName").setVisible(false);
        viewModel.get("parentContractName").setState("bIsNull", true);
      }
    }
  });
// 供应商银行账号 选择条件
viewModel.get("defines!define37_account") &&
  viewModel.get("defines!define37_account").on("beforeBrowse", function (args) {
    debugger;
    var supplierId = viewModel.get("supplierId").getValue();
    if (!supplierId) {
      cb.utils.alert("请先选择供应商！");
      return false;
    }
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "vendor",
      op: "eq",
      value1: supplierId
    });
    this.setFilter(condition);
  });