mtl.chooseImageToServer({
  count: 1,
  sourceType: ["album", "camera"],
  watermark: {
    text: "水印内容",
    position: "0",
    font: 0,
    color: "#ffffff",
    alpha: 0.5
  },
  success: function (res) {
    var pictures = res.pictures; // 图片文件描述列表
    let picture = pictures[0];
    let thumbUrl = picture.thumbUrl; //缩略图地址
    let originalUrl = picture.originalUrl; //原始图片地址
    let originalSize = picture.originalSize; //原始文件大小
  },
  fail: function (err) {
    var message = err.message; // 错误信息
  }
});