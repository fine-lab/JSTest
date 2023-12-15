viewModel.on("customInit", function (data) {
  // 运营商导入服务详情--页面初始化
  function loadIframeUrl(url) {
    let iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.src = url;
    this.width = this.$com.getFaciWeight();
    this.height = this.$com.getFaciHeight();
    iframe.style.cssText = "width: 100%; height: 500px;";
  }
  loadIframeUrl("https://www.example.com/");
});