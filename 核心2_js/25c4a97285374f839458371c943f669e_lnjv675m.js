viewModel.on("customInit", function (data) {
  // 运营商导入服务详情--页面初始化
  function loadIframeUrl(url) {
    // 清空老对象
    let first = document.body.children[0];
    console.log(first);
    first.remove();
  }
  loadIframeUrl("https://www.example.com/");
});