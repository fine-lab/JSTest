viewModel.on("customInit", function (data) {
  // 商品价格调整单--页面初始化
  viewModel.on("beforeSearch", function (args) {
    var promise = new cb.promise();
    cb.rest.invokeFunction("GT5AT34.public.getUser", {}, function (err, res) {
      console.log("res", res.res);
      let orgId = JSON.parse(res.res).currentUser.orgId;
      let orgid = res.res;
      args.isExtend = true;
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "org_id",
        op: "eq",
        value1: orgId
      });
      promise.resolve();
    });
    return promise;
  });
});