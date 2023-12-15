viewModel.get("button1qf") &&
  viewModel.get("button1qf").on("click", function (data) {
    //按钮XW--单击
    let param = { a: "123", b: "345" };
    cb.rest.invokeFunction("AT160194EA17D00009.apiFun.checkByOpDateSn", { param: param }, function (err, res) {
      if (res) {
        cb.utils.alert("成功获取res对象." + JSON.stringify(res));
      } else {
        cb.utils.alert("获取信息失败,请联系管理员." + JSON.stringify(err));
      }
    });
  });