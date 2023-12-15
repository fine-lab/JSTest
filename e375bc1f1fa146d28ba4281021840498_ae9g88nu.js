viewModel.on("customInit", function (data) {
});
viewModel.get("button16ke") &&
  viewModel.get("button16ke").on("click", function (data) {
    // 添加UDI生成规则--单击
    var gridmodel2 = viewModel.getGridModel();
    // 清空下表数据
    gridmodel2.clear();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getUdiCoding",
      {
        typeCode: "GS1" //默认选择gs1 后期可选类型 共三种
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          resultData = [];
          return false;
        } else {
          // 返回具体数据
          resultData = res.proRes;
          for (i = 0; i < resultData.length; i++) {
            let tbrs = {
              applicationIdentifier: resultData[i].udiMeaning,
              identificationCodingNum: resultData[i].udiAi
            };
            // 下表添加行数据
            gridmodel2.appendRow(tbrs);
          }
        }
      }
    );
  });