viewModel.on("customInit", function (data) {
  // 基金信息详情--页面初始化
});
let mode = viewModel.getParams().mode;
viewModel.on("afterLoadData", () => {
  if (mode == "edit" || mode == "add") {
    let data = viewModel.getParams();
    let { backdata } = data;
    if (backdata) {
      viewModel.get("jijinmingchen").setValue(backdata.jijinmingchen_jijinmingchen);
      viewModel.get("jijinjianchen").setValue(backdata.jijinmingchen_jijinmingchen);
      viewModel.get("pifushelishijian").setValue(backdata.zhengfushelishijian);
    }
  }
});
//新增标的公司
viewModel.get("button66ah") &&
  viewModel.get("button66ah").on("click", () => {
    jDiwork.openService("de6163db-c9b2-46eb-92c1-a670b4a4f509");
  });
viewModel.on("afterSave", function (data) {
  // 基金信息详情--页面初始化
  debugger;
  let rowCount = window.localStorage.getItem("rowCount");
  let dq_jjlbModel = JSON.parse(localStorage.getItem("dq_jjlbModel"));
  if (dq_jjlbModel) {
    dq_jjlbModel.insertRow(rowCount);
    dq_jjlbModel.setCellValue(jijinmingchen, rowCount, 1);
    dq_jjlbModel.setCellValue(jijinmingchen_jijinmingchen, rowCount, 1);
  }
});
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
  $(".dq_component").css({ padding: "0 16px" });
  $(".dq-tabs.line-tabs .lineTabsMenu .wui-tabs-nav").css({ marginLeft: "2px" });
  $(".dq-tabs.line-tabs .lineTabsMenu .wui-tabs-nav .wui-tabs-ink-bar").css({ backgroundColor: "#F22E27" });
  $(".dq-tabs.line-tabs .lineTabsMenu .wui-tabs-nav .wui-tabs-tab").css({ backgroundColor: "rgba(242, 46, 39, .4)", color: "#fff" });
  $(".dq-tabs.line-tabs .lineTabsMenu .wui-tabs-nav .wui-tabs-tab .groupTipsTitle").css({ fontSize: "12px", padding: "0 6px" });
  $(".dq-tabs.line-tabs .lineTabsMenu .wui-tabs-nav .wui-tabs-tab.wui-tabs-tab-active").css({ backgroundColor: "#F22E27", color: "#fff" });
  $(".dq-tabs.line-tabs .lineTabsMenu .wui-tabs .wui-tabs-bar").css({ borderBottom: "none" });
  $(".dq-tabs.dq-tabs-notitle.line-tabs .lineTabsMenu .wui-tabs").css({ display: "none" });
  // 整体背景
  $(".wui-tabs-tabpane").css({ backgroundColor: "#fff" });
  $(".dq-bg-white").css({ backgroundColor: "#fff" });
  $(".dq-bg-white .lineTabsMenu").css({ backgroundColor: "#fff" });
  $(".dq-bg-white .card-container").css({ backgroundColor: "#fff" });
  $(".dq-bg-white .group-container").css({ backgroundColor: "#fff" });
  $(".dq-form .form").css({ backgroundColor: "#fff" });
  // 边框
  $(".dq-border").css({ border: "1px solid #DCDDDD", margin: "0 16px" });
  // 标题部分
  $(".main-title").css({ margin: "0 16px", textAlign: "left" });
  $(".main-title .c-title").css({ display: "inline-block", border: "1px solid #F22E27", color: "#F22E27", borderRadius: "24px", padding: "12px 27px", margin: "20px auto" });
  // 表单部分
  $(".dq-form .form").css({ padding: "10px 0" });
  $(".dq-form .form .width-percent-25").css({ marginBottom: "4px" });
  $(".dq-form .form .width-percent-33").css({ marginBottom: "4px" });
  $(".dq-form .form .width-percent-50").css({ marginBottom: "4px" });
  $(".dq-form .form .width-percent-100").css({ marginBottom: "4px" });
  $(".dq-form .form .dq-desc").css({ paddingTop: "0", paddingBottom: "0", marginBottom: "0", marginTpp: "0" });
  // 表单内每一项
  $(".container-edit-mode .dq-form .form .viewCell .basic-control .input-control").css({ backgroundColor: "#fff", height: "30px", lineHeight: "30px", borderRadius: "0" });
  $(".dq-form .form .viewCell .basic-control input").css({ height: "30px", lineHeight: "30px" });
  $(".dq-form .form .viewCell .basic-control textarea").css({ height: "60px", minHeight: "60px" });
  $(".dq-form .form .viewCell .basic-control .refer-input .wui-input-simple-suffix").css({ height: "30px", lineHeight: "30px" });
  $(".dq-form .form .viewCell .basic-control .wui-select-selector").css({ height: "30px", minHeight: "30px" });
  // 查看状态: 表单内每一项
  $(".container-browse-mode .dq-form .form .viewCell .basic-control .input-control").css({ backgroundColor: "#efefef", height: "30px", lineHeight: "30px", borderRadius: "2px" });
  // 顶部搜索区域
  $(".dq-search").css({ margin: "0" });
  $(".dq-search .gxtabs").css({ marginRight: "16px" });
  $(".dq-search > .yon-row .formButtons--cdc19").css({ marginBottom: "0" });
  $(".dq-search > .yon-row .formButtons--cdc19 .meta-default-controls .viewCell").css({ marginBottom: "0" });
  $(".dq-search .form").css({ padding: "0", marign: "0" });
  // 表格部分
  $(".dq-table").css({ paddingTop: "4px" });
  $(".dq-table .fixedDataTableLayout_main").css({ borderTop: "none" });
}
loadScript("https://www.example.com/", { async: false }).then((res) => {
  console.log(res, "加载js完成");
  loadCss();
  $(".wui-tabs-nav").click(() => {
    setTimeout(function () {
      loadCss();
    }, 30);
  });
});
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