viewModel.on("customInit", function (data) {
  // 销售日报主表--页面初始化
});
viewModel.get("button30ek") &&
  viewModel.get("button30ek").on("click", function (data) {
    // 销售出库保存--单击
    var girdModel = viewModel.getGridModel();
    // 获取数据下标
    const indexArr = girdModel.getSelectedRowIndexes();
    if (indexArr.length > 0) {
      for (let i = 0; i < indexArr.length; i++) {
        // 获取行号
        var row = indexArr[i];
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        // 该条单据的id
        var ID = SunData[0].id;
        var ps = SunData[0].pushDown;
        var code = SunData[0].code;
        var businessModel = SunData[0].businessModel;
        if ("1" != businessModel) {
          cb.utils.confirm("销售日报编码为：" + code + "  的销售日报非直营店数据，不可下推！");
          return false;
        } else if (ps == "true") {
          cb.utils.confirm("销售日报编码为：" + code + "  的销售日报已经保存销售出库不可重复保存");
          return false;
        } else {
          //取价表【商品】模板id
          var path = "1484843835893743625";
          let res = cb.rest.invokeFunction("GT5646AT1.apifunction.pathList", { path: path }, function (err, res) {}, viewModel, { async: false });
          if (res.error == undefined) {
            var list = res.result.res.data.recordList;
          } else {
            cb.utils.confirm("销售日报编码为：" + code + "  的错误信息为：" + res.error.message);
          }
          let req = cb.rest.invokeFunction("GT5646AT1.apifunction.selectAll", { sid: ID, sendDataObj: SunData[0], priceList: list }, function (err, res) {}, viewModel, { async: false });
          if (req.error) {
            cb.utils.confirm("销售日报编码为：" + code + "  的错误信息为：" + req.error.message);
            return false;
          }
        }
      }
      cb.utils.confirm("下推销售出库成功！");
      // 销售出库保存成功之后改变下推状态为'是'
      viewModel.execute("refresh");
    } else {
      cb.utils.confirm("未选中数据！");
      return false;
    }
  });