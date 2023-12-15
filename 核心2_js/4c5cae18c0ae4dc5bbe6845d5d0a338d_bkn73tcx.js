viewModel.get("button37yd") &&
  viewModel.get("button37yd").on("click", function (data) {
    // 生成凭证--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asyncVoucher", { huijiqijian: huijiqijian }, function (err, res) {});
      cb.utils.alert("执行成功", "success");
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });
viewModel.get("button30sd") &&
  viewModel.get("button30sd").on("click", function (data) {
    // 下棋成本--单击
  });
viewModel.get("button24mh") &&
  viewModel.get("button24mh").on("click", function (data) {
    // 插入本期成本--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("projectCode").getFromModel().getValue();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asyncQueryCBGJ", { huijiqijian: huijiqijian, xmCode: xmCode }, function (err, res) {});
      cb.utils.alert("执行成功", "success");
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });