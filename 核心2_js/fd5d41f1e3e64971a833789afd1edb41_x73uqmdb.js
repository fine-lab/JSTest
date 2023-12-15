viewModel.on("afterLoadData", (args) => {
  mtl.generateQRCode({
    str: "test512", // 用于生成二维码的字符串
    size: 200, // 生成图片大小，默认 100 * 100
    success: function (res) {
      var src = res.imgSrc;
      let logoImage = document.createElement("img");
      logoImage.src = src;
      document.getElementsByClassName("yonui-card-box yonui-card-box-default")[0].appendChild(logoImage);
    },
    fail: function (err) {
      var message = err.message; // 错误信息
    }
  });
});