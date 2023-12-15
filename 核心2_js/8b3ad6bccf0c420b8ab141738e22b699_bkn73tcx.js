viewModel.get("button24zh") &&
  viewModel.get("button24zh").on("click", function (data) {
    // 生成凭证--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    if (huijiqijian != undefined) {
      let url = "https://www.example.com/";
      let contenttype = "application/json;charset=UTF-8";
      let header = {
        "Content-Type": contenttype
      };
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asyncVoucher", { huijiqijian: huijiqijian }, function (err, res) {});
      cb.utils.alert("执行成功", "success");
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });