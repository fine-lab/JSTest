viewModel.get("payDate") &&
  viewModel.get("payDate").on("beforeValueChange", function (data) {
    // 到期付款日--值改变前
    if (data.value == null) return true;
    var today = new Date();
    var endDate = new Date(data.value);
    if (endDate <= today) {
      cb.utils.alert("到期付款日必须大于当前日期");
      return false;
    }
  });
viewModel.get("button12ye") &&
  viewModel.get("button12ye").on("click", function (data) {
    // 下载--单击
    const rowData = viewModel.getGridModel().getRows()[data.index];
    // 获取token
    cb.rest.invokeFunction("rc_voucher.backOpenApiFunction.getToken", {}, function (err, res) {
      cb.rest.invokeFunction("rc_voucher.backOpenApiFunction.getServiceUrl", { locationUrl: window.location.href }, function (err, resp) {
        const sUrl = resp.resp;
        const fileUrl = `${sUrl}/rc/api/oss?terminalType=1&resourceId=${rowData.address}&yht_access_token=${res.token}&userId=${res.userId}&tenantId=${res.tenantId}&domainKey=isv-rc1`;
        window.open(fileUrl);
      });
    });
  });
viewModel.on("afterLoadData", function () {
  //用于卡片页面，页面初始化赋值等操作
  console.log(viewModel.getParams().mode);
  if (viewModel.getParams().mode !== "add") {
    // 表格1--设置数据源后
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/rc/api/voucher/attachments?id=" + viewModel.get("id").getValue() + "&domainKey=isv-rc1",
        method: "GET"
      }
    });
    //传参
    proxy.settle(function (result) {
      if (result.code === 1) {
        const fileList = result.content.attList.map((item) => {
          return { name: item.name, address: item.address };
        });
        viewModel.getGridModel().setDataSource(fileList);
      } else {
        cb.utils.alert(result.msg, "error");
      }
    });
  }
});
// 上传附件