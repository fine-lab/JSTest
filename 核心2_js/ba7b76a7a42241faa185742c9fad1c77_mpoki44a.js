mtl.generateQRCode({
  str: "", // 用于生成二维码的字符串
  size: 200, // 生成图片大小，默认 100 * 100
  success: function (res) {
    var src = res.imgSrc;
  },
  fail: function (err) {
    var message = err.message; // 错误信息
  }
});