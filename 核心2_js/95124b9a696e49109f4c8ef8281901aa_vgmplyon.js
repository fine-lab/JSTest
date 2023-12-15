function loadScript(src, attrs) {
  return new Promise((resolve, reject) => {
    try {
      let scriptEle = document.createElement("script");
      scriptEle.type = "text/javascript";
      scriptEle.src = src;
      for (let key in attrs) {
        scriptEle.setAttribute(key, attrs[key]);
      }
      scriptEle.addEventListener("load", function () {
        resolve("成功");
      });
      document.body.appendChild(scriptEle);
    } catch (err) {
      reject(err);
    }
  });
}
function loadCss() {
  // 背景
  $(".dq-bg-white").css({ backgroundColor: "#fff" });
  $(".dq-border").css({ backgroundColor: "#fff" });
  $(".dq-bg-white .wui-tabs .wui-tabs-content .wui-tabs-tabpane").css({ backgroundColor: "#fff" });
  $(".wui-tabs-tabpane").css({ backgroundColor: "#fff" });
  //边框
  $(".dq-border").css({ border: "1px solid #DCDDDD", margin: "0 16px", marginBottom: "8px" });
  // 标题部分
  $(".main-title").css({ margin: "0 16px", textAlign: "left" });
  $(".main-title .c-title").css({ display: "inline-block", border: "1px solid #F22E27", color: "#F22E27", borderRadius: "24px", padding: "12px 27px", margin: "20px auto" });
  // 表单部分
  $(".dq-form ").css({ padding: "10px 0" });
  $(".dq-form .width-percent-25").css({ marginBottom: "4px" });
  $(".dq-form .width-percent-33").css({ marginBottom: "4px" });
  $(".dq-form .width-percent-50").css({ marginBottom: "4px" });
  $(".dq-form .width-percent-100").css({ marginBottom: "4px" });
  $(".dq-form .dq-desc").css({ paddingTop: "0", paddingBottom: "0", marginBottom: "0", marginTpp: "0" });
}
loadScript("https://www.example.com/", { async: false }).then((res) => {
  console.log(res, "加载js完成");
  loadCss();
  // 编辑按钮
  viewModel.get("btnEdit") &&
    viewModel.get("btnEdit").on("click", function () {
      setTimeout(() => {
        loadCss();
      }, 100);
    });
  // 取消按钮
  viewModel.get("btnAbandon") &&
    viewModel.get("btnAbandon").on("click", function () {
      setTimeout(() => {
        loadCss();
      }, 100);
    });
  // 保存按钮
  viewModel.get("btnSave") &&
    viewModel.get("btnSave").on("click", function () {
      setTimeout(() => {
        loadCss();
      }, 100);
    });
  // 保存新增按钮
  viewModel.get("btnSaveAndAdd") &&
    viewModel.get("btnSaveAndAdd").on("click", function () {
      setTimeout(() => {
        loadCss();
      }, 100);
    });
});