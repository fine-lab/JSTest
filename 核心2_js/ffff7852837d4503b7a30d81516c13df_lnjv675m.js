viewModel.on("customInit", function (data) {
  viewModel.on("afterLoadData", function (args) {
    mtl.generateQRCode({
      str: "code2121", // 用于生成二维码的字符串
      size: 300, // 生成图片大小，默认 100 * 100
      success: function (res) {
        var src = res.imgSrc;
        viewModel.get("tupian").setValue(src);
      },
      fail: function (err) {
        var message = err.message; // 错误信息
      }
    });
  });
});