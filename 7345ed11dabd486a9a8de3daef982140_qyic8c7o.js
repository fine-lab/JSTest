viewModel.get("button13ug") &&
  viewModel.get("button13ug").on("click", function (data) {
    // 同步更新--单击
    cb.rest.invokeFunction("b321dfd3cbad4090893fd54078b199c5", {}, function (err, res) {
      if (err) {
        console.log("err", err);
        cb.utils.alert(err);
      } else {
        console.log("res", res);
        cb.utils.alert("共同步成功" + res.res.length + "条数据！");
      }
    });
  });