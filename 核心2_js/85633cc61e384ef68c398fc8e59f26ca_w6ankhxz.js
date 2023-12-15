viewModel.on("customInit", function (data) {
  // 凭证转让详情--页面初始化
  // 接收时禁用明细编辑
  const isReceive = viewModel.getParams().optType === "receive" ? true : false;
  const param = viewModel.get("rc_vtrans_itemList");
  const receiveResult = viewModel.get("receiveResult");
  if (isReceive) {
    param.setState("bCanModify", false);
    receiveResult.setState("bMustSelect", true);
    receiveResult.setState("bIsNull", false); // 必填
  } else {
    param.setState("bCanModify", true);
  }
});
viewModel.get("button21kb") &&
  viewModel.get("button21kb").on("click", function (data) {
    // 下载--单击
    const rowData = viewModel.getGridModel("rc_voucher_trans_attachmentsList").getRows()[data.index];
    // 获取token
    cb.rest.invokeFunction("rc_voucher.backOpenApiFunction.getToken", {}, function (err, res) {
      // 获取不同环境服务地址
      cb.rest.invokeFunction("rc_voucher.backOpenApiFunction.getServiceUrl", { locationUrl: window.location.href }, function (err, resp) {
        const sUrl = resp.resp;
        const fileUrl = `${sUrl}/rc/api/oss?terminalType=1&resourceId=${rowData.address}&yht_access_token=${res.token}&userId=${res.userId}&tenantId=${res.tenantId}&domainKey=isv-rc1`;
        window.open(fileUrl);
      });
    });
  });
viewModel.on("afterLoadData", function (data) {
  //数据加载之后
  if (viewModel.getParams().mode !== "add") {
    // 调接口查附件
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/rc/api/voucher/transfer/attachments?id=" + viewModel.get("id").getValue() + "&domainKey=isv-rc1",
        method: "GET"
      }
    });
    proxy.settle(function (result) {
      if (result.code === 1) {
        const fileList = result.content.attList.map((item) => {
          return { name: item.name, address: item.address };
        });
        viewModel.getGridModel("rc_voucher_trans_attachmentsList").setDataSource(fileList);
      } else {
        cb.utils.alert(result.msg, "error");
      }
    });
  }
  // 设置账号信息必填&必传
  const isReceive = viewModel.getParams().optType === "receive" ? true : false;
  const accCode = viewModel.get("accCode");
  const accBank = viewModel.get("accBank");
  const accName = viewModel.get("accName");
  // 同意接收，设置账号必填且必传
  if (isReceive && data.receiveResult == 0) {
    accCode.setState("bIsNull", false); // 必填
    accBank.setState("bIsNull", false); // 必填
    accName.setState("bIsNull", false); // 必填
    accCode.setState("bMustSelect", true); // 必传
    accBank.setState("bMustSelect", true); // 必传
    accName.setState("bMustSelect", true); // 必传
  } else {
    accCode.setState("bIsNull", true); // 非必填
    accBank.setState("bIsNull", true); // 非必填
    accName.setState("bIsNull", true); // 非必填
    accCode.setState("bMustSelect", false); // 非必传
    accBank.setState("bMustSelect", false); // 非必传
    accName.setState("bMustSelect", false); // 非必传
  }
});
viewModel.get("receiveResult") &&
  viewModel.get("receiveResult").on("afterValueChange", function (data) {
    // 凭证接收意见--值改变后
    const isReceive = viewModel.getParams().optType === "receive" ? true : false;
    const accCode = viewModel.get("accCode");
    const accBank = viewModel.get("accBank");
    const accName = viewModel.get("accName");
    // 同意接收，设置账号必填且必传
    if (isReceive && data.value.value == 0) {
      accCode.setState("bIsNull", false); // 必填
      accBank.setState("bIsNull", false); // 必填
      accName.setState("bIsNull", false); // 必填
      accCode.setState("bMustSelect", true); // 必传
      accBank.setState("bMustSelect", true); // 必传
      accName.setState("bMustSelect", true); // 必传
    } else {
      accCode.setState("bIsNull", true); // 非必填
      accBank.setState("bIsNull", true); // 非必填
      accName.setState("bIsNull", true); // 非必填
      accCode.setState("bMustSelect", false); // 非必传
      accBank.setState("bMustSelect", false); // 非必传
      accName.setState("bMustSelect", false); // 非必传
    }
  });
viewModel.on("beforeSave", function (args) {
  const voucherList = viewModel.getGridModel("rc_vtrans_itemList").getRows();
  const argsInfo = JSON.parse(args.data.data);
  const detailList = argsInfo.rc_vtrans_itemList;
  if (!detailList && viewModel.getParams().optType !== "receive") {
    // 编辑时如果没有修改凭证本次金额，保存就不会带上明细，导致报错。
    // 手动给传参加上明细列表，方法无效
    cb.utils.alert("请重新输入本次转让金额或重新选择凭证", "error");
    return false;
  }
  if (voucherList[0].amount > voucherList[0]["item96se"]) {
    cb.utils.alert("本次转让金额不能大于凭证金额", "error");
    return false;
  }
});
viewModel.get("rc_vtrans_itemList") &&
  viewModel.get("rc_vtrans_itemList").getEditRowModel() &&
  viewModel.get("rc_vtrans_itemList").getEditRowModel().get("amount") &&
  viewModel
    .get("rc_vtrans_itemList")
    .getEditRowModel()
    .get("amount")
    .on("blur", function (data) {
      // 本次转让金额--失去焦点的回调
      const voucherInfo = viewModel.getGridModel("rc_vtrans_itemList").getRows()[0];
      viewModel.get("amount").setValue(voucherInfo.amount);
    });