const params = viewModel.getParams();
var x = 0;
viewModel.on("afterLoadData", function (data) {
  // 安装工单--页面初始化
  var iiid = params.perData[0].id;
  if (params.perData != undefined) {
    cb.rest.invokeFunction("IMP_PES.common.getEqId", { equidCode: params.perData[0].productsku_cCode }, function (err, res) {
      var equ_Id = res.equipment_Id[0].id;
      var row_data = {
        equId: equ_Id,
        equId_equip_name: params.perData[0].product_cName,
        equId_equip_code: params.perData[0].productsku_cCode
      };
      if (x == 0) {
        viewModel.get("smsSosEquipmentList").insertRow(1, row_data);
        ++x;
      }
    });
    viewModel.get("customId").setValue(params.perData[0].cust); // 客户customId
    viewModel.get("customId_name").setValue(params.perData[0].cust_name); // 客户
    viewModel.get("contactName").setValue(params.perData[0].cReceiver); // 联系人
    viewModel.get("smsSosAttrextItem!define21").setValue(params.perData[0].srcBillNO);
  }
});
cb.rest.invokeFunctionExtend = function (id, data, callback, viewModel, options) {
  if (!options) {
    var options = {};
    options.domainKey = cb.utils.getActiveDomainKey();
  }
  if (options.domainKey == null && viewModel != undefined) {
    options.domainKey = viewModel.getDomainKey();
  }
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  if (options.async == false) {
    return proxy.doProxy(data, callback);
  } else {
    proxy.doProxy(data, callback);
  }
};
viewModel.get("equId_equip_name") &&
  viewModel.get("equId_equip_name").on("afterValueChange", function (data) {
    // 设备--值改变后
    const equId = viewModel.get("equId").getValue();
    const equId_equip_name = viewModel.get("equId_equip_name").getValue();
    const customId_name = viewModel.get("customId_name").getValue();
  });
// 设置保存前校验
debugger;
viewModel.on("afterOkClick", () => {
  debugger;
  alert("afterOkClick");
});
viewModel.on("beforeClose", () => {
  debugger;
  alert("beforeClose");
});
viewModel.on("afterSaveComplete", (data) => {
  var outId = params.perData[0].srcBillNO;
  var salesOutId = params.perData[0].id;
  let { err } = data;
  if (err && err.code) {
    return false;
  } else {
    let completeAt = data.completeAt;
    console.log("compDate:", completeAt);
    if (data.id != null && data.id != undefined) {
      cb.rest.invokeFunction("IMP_PES.openApi.modifyDataa", { complete_At: completeAt, out_Id: outId }, function (err, res) {}),
        cb.rest.invokeFunction("IMP_PES.openApi.modfOut", { complete_At: completeAt, out_Id: salesOutId }, function (err, res) {});
    }
  }
});