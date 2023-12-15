viewModel.on("customInit", function (data) {
  // 我的党费--页面初始化
  debugger;
  var viewModel = this;
  var user = cb.rest.AppContext.user;
  var userId = user.userId;
  const value = viewModel.get("title").getValue();
  viewModel.on("beforeSearch", function (args) {
    //字段sex等于男的数据进行查询
    args.params.condition.simpleVOs = [
      {
        field: "yuserid",
        op: "eq",
        value1: userId
      }
    ];
    //等同于 args.params.condition.commonVOs = [{"itemName":"schemeName","value1":"默认方案"},{"itemName":"isDefault","value1":true},{"value1":"20","itemName":"age"}]
  });
});