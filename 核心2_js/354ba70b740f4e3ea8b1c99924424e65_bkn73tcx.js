viewModel.get("button24fa") &&
  viewModel.get("button24fa").on("click", function (data) {
    // 生成下期期初--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let project = filtervm.get("project").getFromModel().getValue();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT99994AT1.api.asycBudget", { huijiqijian: huijiqijian, project: project }, function (err, res) {});
      cb.utils.alert("执行成功", "success");
    } else {
      cb.utils.alert("会计期间字段必填，请检查输入后重试", "error");
    }
  });