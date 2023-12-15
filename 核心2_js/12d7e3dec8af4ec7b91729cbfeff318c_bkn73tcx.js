viewModel.get("button24lc") &&
  viewModel.get("button24lc").on("click", function (data) {
    // 下期预算--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    //判断会否选择了项目
    let projectVO = filtervm.get("projectVO").getFromModel().getValue();
    if (huijiqijian) {
      cb.utils.alert(huijiqijian);
      let param = {
        huijiqijian: huijiqijian,
        projectVO: projectVO == undefined ? null : projectVO
      };
      //调用后端函数生成下月期初
      var rst = cb.rest.invokeFunction("GT99994AT1.api.sendNextBudget", param, function (err, res) {}, viewModel, { async: false });
      cb.utils.alert(rst, "error");
    } else {
      cb.utils.alert("请选择会计期间", "error");
      return;
    }
    let messages = [];
  });