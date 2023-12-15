viewModel.get("button31ae") &&
  viewModel.get("button31ae").on("click", function (data) {
    // 登录--单击
  });
viewModel.on("customInit", function (data) {
});
viewModel.get("button21pe") &&
  viewModel.get("button21pe").on("click", function (data) {
    // 绑定--单击
    mtl.unitifyLogin.bindWithYhtAndThirdAccount({
      username: "xxx",
      password: "yourpasswordHere",
      success: function (res) {
        var result = res.data;
      },
      fail: function (err) {
        var message = err.message; // 错误信息
      }
    });
  });