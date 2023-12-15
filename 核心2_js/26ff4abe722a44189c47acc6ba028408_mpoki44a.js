viewModel.on("afterLoadData", function (args) {
  cb.rest.invokeFunction("GT3AT2.backDesignerFunction.getUserType", {}, function (err, res) {
    let userType = res.data[0].userType;
    if (userType == 1) {
      //当用户类型为供应商时，更改商函的查看状态为已读
      let datauri = "GT3AT2.GT3AT2.shejibiangeng_A";
      data.GYSCKZT = "1";
      cb.rest.invokeFunction("GT3AT2.backDesignerFunction.supplyReaded", { data, datauri: datauri }, function (err, res) {});
    }
  });
});