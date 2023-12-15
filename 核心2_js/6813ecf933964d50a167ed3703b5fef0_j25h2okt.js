viewModel.on("customInit", function (data) {
  // 拉取调拨入库数据--页面初始化
});
//依据当前登陆人所属组织过滤数据
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  //通用检查查询条件
  var condition = args.params.condition;
  condition.simpleVOs = [
    {
      logicOp: "and",
      conditions: [
        {
          field: "bustype",
          op: "in",
          value1: ["1471576020389199875", "1471576192197328907"] //工厂间(DR02)、工厂与物流DR03
        }
      ]
    }
  ];
  let loginOrgRes = cb.rest.invokeFunction("GT101792AT1.API.queryLoginOrg", {}, function (err, res) {}, viewModel, { async: false });
});