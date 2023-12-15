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
        itemName: "shoujiandanweishoujianren_A",
        op: "eq",
        value1: result.result.data[0].id
      });
    }
  });
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    let referModel = filtervm.get("xiangmumingchen").getFromModel();
    //获取组织参照
    let orgRefModel = filtervm.get("org_id").getFromModel();
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