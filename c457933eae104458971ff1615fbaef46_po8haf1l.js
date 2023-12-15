viewModel.on("customInit", function (data) {
  var viewModel = this;
  viewModel.on("beforExeQueryMemberProxy", function (args) {
    console.log("查询会员：" + JSON.stringify(args));
    cb.rest.invokeFunction(
      "RM.backOpenApiFunction.memberQueryApi",
      { phone: args.number },
      function (err, res) {
        res = JSON.stringify(res);
        console.log("res：" + res);
        if (res.indexOf("会员不存在") != -1) {
          cb.utils.alert("会员不存在");
        } else if (res.indexOf("会员查询完毕") != -1) {
          cb.utils.alert("会员查询完毕,请再次查询会员");
          viewModel.on("extendAddMember", function (args) {
            return false;
          });
        } else if (res.indexOf("会员存在") != -1) {
        }
      },
      viewModel,
      { async: true }
    );
  });
  //零售开单商品新增时
  viewModel.on("beforeAddProduct", function (args) {
    console.log("开单：" + JSON.stringify(args));
  });
  viewModel.on("beforeSettleViewOpen", function (args) {
    console.log("零售开单结算弹窗：" + JSON.stringify(args));
  });
  //零售结算时
  viewModel.on("beforeShowSuccessTips", function (args) {
    args = args.result;
    console.log("零售结算时：" + JSON.stringify(args));
    cb.rest.invokeFunction("RM.backOpenApiFunction.sendOederInfo", { data: args }, function (err, res) {
      console.log("sendOederInfo：" + JSON.stringify(res));
    });
    cb.rest.invokeFunction("RM.backOpenApiFunction.sendConsume", { data: args }, function (err, res) {
      console.log("sendConsume：" + JSON.stringify(res));
    });
  });
});
var yichang = function () {
  throw new Error("获取中台会员信息失败");
};
viewModel.on("extendAddMember", function (args) {
  return false;
});