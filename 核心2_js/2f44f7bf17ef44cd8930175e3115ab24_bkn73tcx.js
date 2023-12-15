viewModel.get("button24ne") &&
  viewModel.get("button24ne").on("click", function (data) {
    // 生成下期预算--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    cb.utils.alert(huijiqijian, "error");
  });