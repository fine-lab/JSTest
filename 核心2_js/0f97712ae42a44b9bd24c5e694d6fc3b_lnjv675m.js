viewModel.get("button2gc") &&
  viewModel.get("button2gc").on("click", function (data) {
    // 按钮--单击
    console.log(document.cookie);
  });
viewModel.get("button4of") &&
  viewModel.get("button4of").on("click", function (data) {
    // 对话框--单击
    cb.utils.confirm(
      "用户将稍后生成，请等待!\n",
      function () {},
      function () {
        returnPromise.reject(err);
      }
    );
  });
viewModel.get("button5zj") &&
  viewModel.get("button5zj").on("click", function (data) {
    //按钮--单击
    cb.rest.invokeFunction("GT9912AT31.common.dataAdd", { type: "sysdate" }, function (err, res) {
      console.log(res);
    });
  });