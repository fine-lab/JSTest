viewModel.on("customInit", function (data) {
  //现存量仓库组织对照表--页面初始化
  viewModel.get("button23cj").on("click", function (data) {
    //更新现存量--单击
    let proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/functionApi/exec?funServiceName=DetailToStockOrgISVFunction",
        method: "GET",
        options: {
          domainKey: viewModel.getDomainKey()
        }
      }
    });
    proxy.doProxy({}, (err, res) => {
      console.log(res);
      if (!res.code || res.code != 200) {
        cb.utils.alert(res.msg || JSON.stringify(res));
        return;
      }
      cb.utils.alert("更新现存量调用成功，请等待定时任务执行完成（查看“业务日志”等待结果日志）查看现存量数据！");
    });
  });
});