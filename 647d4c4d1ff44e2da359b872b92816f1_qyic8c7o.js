viewModel.get("button13jg") &&
  viewModel.get("button13jg").on("click", function (data) {
    // 同步--单击
    cb.rest.invokeFunction("0ce1f8e9f7ae42beaf3a26253a5e9137", {}, function (err, res) {
      if (err) {
        console.log("err", err);
        cb.utils.alert(err);
      } else {
        console.log("res", res);
        cb.utils.alert("共同步成功" + res.res.length + "条数据！");
      }
    });
  });