viewModel.on("customInit", function (data) {
  // 业务配置详情--页面初始化
  // 保存
  viewModel.get("button6de").on("click", function () {
    const proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: `/bip/feeConf/save?&domainKey=${viewModel.getDomainKey()}`,
        method: "POST"
      }
    });
    const data = viewModel.getData();
    data.bizType = "01";
    proxy.settle(data, function (error, result) {
      if (error) {
        cb.utils.alert(error.message, "error");
        return;
      } else {
        // 成功提示
        cb.utils.alert("保存成功", "success");
        // 关闭模态框
        viewModel.communication({ type: "modal", payload: { data: false } });
        //手动刷新父页面，重新加载
        viewModel.getCache("parentViewModel").execute("refresh");
      }
    });
  });
});