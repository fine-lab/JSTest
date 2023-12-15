//页面DOM加载完成
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  let result = cb.rest.invokeFunction(
    "GT3AT2.backDesignerFunction.getSupplyByUser",
    {},
    function (err, res) {
      debugger;
      console.log(res);
    },
    viewModel,
    { async: false }
  );
  debugger;
  // 检索之前进行条件过滤
  filtervm.on("beforeSearch", function (args) {
    debugger;
    if (result.result.data.length != 0 && result.result.data[0].id) {
      args.isExtend = true;
      //通用检查查询条件
      var commonVOs = args.commonVOs;
      commonVOs.push({
        itemName: "shigongdanweifuzeren_contactname",
        op: "eq",
        value1: result.result.data[0].id
      });
    }
  });
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    let referModel = filtervm.get("xiangmumingchen").getFromModel();
    //获取组织参照
    let orgRefModel = filtervm.get("baseOrg").getFromModel();
    orgRefModel.on("afterValueChange", function (args) {
      let org_value = orgRefModel.getValue();
      debugger;
      //参照模型初始化完成
      referModel.on("beforeBrowse", function (args) {
        //主要代码
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "orgid",
          op: "eq",
          value1: org_value
        });
        if (org_value) {
          //设置过滤条件
          this.setFilter(condition);
        } else {
          this.setFilter({
            isExtend: true,
            simpleVOs: []
          });
        }
      });
    });
  });
});
viewModel.on("afterLoadData", function (args) {
  cb.rest.invokeFunction("GT3AT2.backDesignerFunction.getUserType", {}, function (err, res) {
    let userType = res.data[0].userType;
    if (userType == 1) {
      //当用户类型为供应商时，更改商函的查看状态为已读
      cb.rest.invokeFunction("GT3AT2.backDesignerFunction.supplyIsRead", { data }, function (err, res) {});
    }
  });
});