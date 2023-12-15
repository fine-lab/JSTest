viewModel.on("afterLoadData", function (args) {
  cb.rest.invokeFunction("GT3AT2.backDesignerFunction.getUserType", {}, function (err, res) {
    let userType = res.data[0].userType;
    if (userType == 1) {
      //当用户类型为供应商时，更改供应商的查看状态为已读
      let datauri = "GT3AT2.GT3AT2.shejibiangeng_A";
      data.GYSCKZT = "1";
      cb.rest.invokeFunction("GT3AT2.backDesignerFunction.supplyReaded", { data, datauri: datauri }, function (err, res) {});
    }
  });
});
//页面DOM加载完成
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    let referModel = filtervm.get("zhusongrenyuan_name").getFromModel();
    //获取组织参照
    let orgRefModel = filtervm.get("zhusongdanxuan").getFromModel();
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
viewModel.get("1671691140835_1").on("click", function (data) {
  debugger;
  var args = {
    cCommand: "cmdUnsubmit",
    cAction: "unsubmit",
    cSvcUrl: "/bill/unsubmit",
    cHttpMethod: "POST",
    domainKey: "yourKeyHere"
  };
  viewModel.biz.do("unsubmit", viewModel, args);
});
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "14278c9f";
});