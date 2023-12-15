viewModel.on("customInit", function (data) {
  // 多页签列表测试3--页面初始化
  //给查询区赋值---动态参数
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    var wlcode = viewModel.get("params").matcode; //取值，提取控件物料编码的值
    var wlname = viewModel.get("params").matname; //取值，提取控件物料名称的值
    //查询区模型DOM初始化后
    filtervm.on("afterInit", function () {
      //赋予查询区字段初始值
      //给查询条件(物料编码)赋予动态默认值，此值由上一级页面传入
      filtervm.get("matcode").getFromModel().setValue(wlcode);
      filtervm.get("matname").getFromModel().setValue(wlname);
    });
    filterViewModelInfo.get("search").fireEvent("click"); //通过代码触发搜索操作
  });
});
//手动返回上个页面
viewModel.get("button7mi").on("click", function () {
  viewModel.communication({ type: "return" });
});