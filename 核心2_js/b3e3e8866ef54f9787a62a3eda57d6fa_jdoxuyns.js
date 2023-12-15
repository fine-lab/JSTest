viewModel.get("button20ge") &&
  viewModel.get("button20ge").on("click", function (data) {
    // 数据初始化--单击
    // 初始化数据--单击
    //请求地址
    var url = "/spc/api/v1/chart/SpcTenantInit";
    var options = {
      domainKey: "yourKeyHere"
    };
    //请求接口
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: url,
        method: "post",
        options: options
      }
    });
    proxy.settle({}, function (err, result) {
      if (err) {
        cb.utils.alert(err.msg, "error");
        return;
      } else {
        console.log(JSON.stringify(result));
        cb.utils.alert("刷新成功");
      }
    });
  });