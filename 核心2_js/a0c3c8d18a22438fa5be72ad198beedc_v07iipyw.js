viewModel.on("customInit", function (data) {
  mtl.unitifyLogin.loginByThirdAccount({
    lang: "zh_cn",
    success: function (res) {
      var result = res.data;
    },
    fail: function (err) {
      var message = err.message; // 错误信息
    }
  });
});
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 保存--单击
    mtl.unitifyLogin.bindWithYhtAndThirdAccount({
      username: viewModel.get("username").getValue(),
      password: viewModel.get("password").getValue(),
      lang: "zh_cn",
      success: function (res) {
        var result = res.data;
      },
      fail: function (err) {
        var message = err.message; // 错误信息
      }
    });
  });
viewModel.get("button1ac") &&
  viewModel.get("button1ac").on("click", function (data) {
    // 按钮--单击
    mtl.unitifyLogin.bindWithYhtAndThirdAccount({
      username: viewModel.get("username").getValue(),
      password: viewModel.get("password").getValue(),
      lang: "zh_cn",
      success: function (res) {
        var result = res.data;
      },
      fail: function (err) {
        var message = err.message; // 错误信息
      }
    });
  });