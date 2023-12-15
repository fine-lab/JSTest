viewModel.on("customInit", function (data) {
  // 区域信息--页面初始化
  viewModel.on("afterMount", function (event) {
    //先获取查询区条件模型
    let filterViewModel = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filterViewModel.on("afterInit", function () {
      //获取参照模型的真实模型
      let referModel = filterViewModel.get("pk_region").getFromModel();
      //模型控件的值变化事件
      referModel.on("afterValueChange", function (data) {
        //设置省控件的值
        filterViewModel.get("vprov").getFromModel().setValue(data.value["vprov"]);
        //设置市控件的值
        filterViewModel.get("vcity").getFromModel().setValue(data.value["vcity"]);
        //设置区控件的值
        filterViewModel.get("vcounty").getFromModel().setValue(data.value["vcounty"]);
        filterViewModel.get("vpostcode").getFromModel().setValue(data.value["vpostcode"]);
        filterViewModel.get("vshortcode").getFromModel().setValue(data.value["vshortcode"]);
        filterViewModel.get("bintl").getFromModel().setValue(data.value["bintl"]);
      });
    });
  });
});