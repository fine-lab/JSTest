viewModel.get("button18nb") &&
  viewModel.get("button18nb").on("click", function (data) {
    // 重推--单击
    cb.rest.invokeFunction("GT879AT352.apiEnd.repeatInsertXFHT", { id: data.id4ActionAuth }, function (err, res) {
      console.log(res);
      if (res.res) {
        cb.utils.alert("推送成功");
      } else {
        cb.utils.alert("推送失败");
      }
      viewModel.execute("refresh");
    });
  });