viewModel.on("customInit", function (data) {
  //支持人员--页面初始化
  var id = viewModel.getParams().perData;
  cb.utils.alert(id);
  if (id != null && id != "undefined") {
    viewModel.on("beforeSearch", function (args) {
      args.isExtend = true;
      //通用检查查询条件
      var commonVOs = args.params.condition.commonVOs;
      commonVOs.push({
        itemName: "fuwudanzhujian",
        op: "eq",
        value1: id
      });
    });
  }
});