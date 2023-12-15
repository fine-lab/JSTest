function toThousands(num) {
  var result = [],
    counter = 0;
  num = (num || 0).toString().split("");
  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(num[i]);
    if (!(counter % 3) && i != 0) {
      result.unshift(",");
    }
  }
  return result.join("");
}
viewModel.on("afterMount", function (data) {
  // 清分明细--页面挂载后
  // 获取列表页跳转时带的参数，凭证详情
  const rowData = viewModel.getParams().rowData;
  // 清分状态为'1'，展示【确定清分】按钮
  if (rowData.isSettel === "1") {
    viewModel.get("button23pe").setVisible(true);
  } else {
    viewModel.get("button23pe").setVisible(false);
  }
  // 首发凭证信息
  viewModel.get("item50af").setValue(rowData.voucherCode);
  viewModel.get("item102gi").setValue(rowData.drawerName);
  viewModel.get("item155pd").setValue(rowData.drawerUscc);
  viewModel.get("item209db").setValue(rowData.receiverName);
  viewModel.get("item264yc").setValue(rowData.receiverUscc);
  viewModel.get("item320qk").setValue(rowData.financialName);
  viewModel.get("item377ai").setValue(rowData.financialUscc);
  viewModel.get("item749tc").setValue(toThousands(rowData.amount));
  viewModel.get("item647pa").setValue(rowData.currency);
  viewModel.get("item544eb").setValue(rowData.effectiveDate);
  viewModel.get("item595fb").setValue(rowData.payDate);
  //设置属性禁用
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "/rc/api/voucher/settleList",
      method: "GET"
    }
  });
  //传参
  var param = { id: rowData.id, domainKey: "yourKeyHere" };
  proxy.settle(param, function (result) {
    if (result.code === 1) {
      const gridModel = viewModel.getGridModel();
      gridModel.setState("dataSourceMode", "local");
      gridModel.setDataSource(result.content.list);
      // 计算凭证总金额
    } else {
      cb.utils.alert(result.message || result.msg, "error");
    }
  });
  // 禁用表格双击事件
  viewModel.getGridModel().setState("forbiddenDblClick", true);
});
viewModel.get("button23pe") &&
  viewModel.get("button23pe").on("click", function (data) {
    // 确定清分--单击
    const rowData = viewModel.getParams().rowData;
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/rc/api/voucher/settle?domainKey=isv-rc1",
        method: "POST"
      }
    });
    //传参
    var param = { id: rowData.id };
    proxy.settle(param, function (result) {
      if (result.code === 1) {
        cb.utils.alert("操作成功", "success");
        // 手动返回上个页面并刷新数据
        viewModel.communication({ type: "return", payload: { data: true } });
      } else {
        cb.utils.alert(result.msg, "error");
      }
    });
  });
viewModel.on("customInit", function (data) {
  // 清分明细--页面初始化
  viewModel.get("item647pa").setState("bCanModify", false);
});