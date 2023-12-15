viewModel.on("customInit", function (data) {
  // 客户费用单列表-金额--页面初始化
  let dataRowSet = [];
  const items = [{}];
  viewModel.on("beforeBatchdelete", function (args) {
    dataRowSet = viewModel.getGridModel().getSelectedRows();
    debugger;
  });
  viewModel.on("afterBatchdelete", function (args) {
    for (let i = 0; i < dataRowSet.length; i++) {
      if (dataRowSet[i]["verifystate"] == 0) {
        items[i]["rebateid"] = dataRowSet[i]["headItem!define1"];
        items[i]["rebateMoney"] = dataRowSet[i]["rebateMoney"];
      }
    }
    debugger;
    //跨应用YonQL查询:改写调用函数
    cb.rest.invokeFunction1 = function (id, data, callback, viewModel, options) {
      let proxy = cb.rest.DynamicProxy.create({
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
    //获取GSP参数信息
    let result = cb.rest.invokeFunction1("AT16388E3408680009.backOpenApiFunction.delExtendsApi", { data: items }, function (err, res) {}, undefined, { domainKey: "yourKeyHere" });
  });
});