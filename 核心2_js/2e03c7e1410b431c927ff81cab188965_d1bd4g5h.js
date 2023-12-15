viewModel.on("customInit", function (data) {
  // 客户费用单列表-金额--页面初始化
  let dataRowSet = [];
  let resubody = [];
  viewModel.on("beforeBatchdelete", function (args) {
    const its = [];
    dataRowSet = viewModel.getGridModel().getSelectedRows();
    resubody = [];
    for (let i = 0; i < dataRowSet.length; i++) {
      resubody.push({
        rebateid: dataRowSet[i]["headItem!define1"],
        rebateMoney: dataRowSet[i]["rebateMoney"],
        agentfid: dataRowSet[i]["id"]
      });
    }
    if (dataRowSet.length == 0) {
      dataRowSet = JSON.parse(args.data.data);
      its.push({
        rebateMoney: dataRowSet[0]["rebateMoney"],
        agentfid: dataRowSet[0]["id"]
      });
      cb.rest.invokeFunction("29a5682f368e431492a1905600feab6d", { data: its }, function (err, res) {
        resubody.push({
          rebateid: res.body.rebateid,
          rebateMoney: res.body.rebateMoney,
          agentfid: res.body.agentfid
        });
      });
    }
    debugger;
  });
  viewModel.on("afterBatchdelete", function (args) {
    const items = [];
    for (let i = 0; i < dataRowSet.length; i++) {
      if (dataRowSet[i]["verifystate"] == 0) {
        items.push({
          rebateid: dataRowSet[i]["headItem!define1"],
          rebateMoney: dataRowSet[i]["rebateMoney"],
          agentfid: dataRowSet[i]["id"]
        });
      }
    }
    if (items.length == 1 && items[0].rebateid == undefined) {
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
      let result = cb.rest.invokeFunction1(
        "AT16388E3408680009.backOpenApiFunction.delExtendsApi",
        { data: resubody },
        function (err, res) {
        },
        undefined,
        { domainKey: "yourKeyHere" }
      );
    } else {
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
      let result = cb.rest.invokeFunction1(
        "AT16388E3408680009.backOpenApiFunction.delExtendsApi",
        { data: resubody },
        function (err, res) {
        },
        undefined,
        { domainKey: "yourKeyHere" }
      );
    }
    debugger;
  });
});