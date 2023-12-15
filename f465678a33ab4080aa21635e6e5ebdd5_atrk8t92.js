mtl.downloadFile({
  url: "https://www.baidu.com",
  fileType: "html",
  fileName: "baidu.txt",
  autoPreview: 0,
  header: {},
  formBody: {},
  jsonBody: "",
  success: function (res) {
    // 成功回调
  },
  fail: function (err) {
    var message = err.message; // 错误信息
  }
});