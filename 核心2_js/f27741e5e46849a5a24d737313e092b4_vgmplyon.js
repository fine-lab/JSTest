viewModel.on("afterInit", (args) => {
  var viewModel = this;
  cb.rest.invokeFunction("AT165369EC09000003.apifunc.PPUserGetStaff", {}, function (err, res) {
    if (err) {
      cb.utils.alert("查询人员信息错误!");
    }
    if (res) {
      cb.cache.set("StaffId", res.userMsg.staffId);
    }
  });
});
viewModel.on("afterMount", () => {
  loadStyle1();
});
//加载自定义样式 (无异步、css不生效问题，效果好)
function loadStyle1(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
  .Modal-DetailItemInfo .ys-footer.isDesign, .am-tabs-pane-wrap-active .ys-footer.isDesign, .ys-drawer-open .ys-drawer-content .ys-footer.isDesign {
    display: none;
  }
  `;
  headobj.appendChild(style);
}
viewModel.on("beforeSearch", function (data) {
  // 个人积分--页面初始化
  let staffId = cb.cache.get("StaffId");
  console.log("StaffId", staffId);
  data.isExtend = true;
  commonVOs = data.params.condition.commonVOs;
  commonVOs.push({
    itemName: "staff",
    op: "neq",
    value1: staffId
  });
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\30 9afad50MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_09afad50MobileList > div.am-flexbox.yonui-mobile-flex-runtime.undefined.am-flexbox-dir-row.am-flexbox-align-center"
  ).style.display = "none";
});
viewModel.getGridModel().on("afterSetDataSource", (args) => {
  debugger;
  viewModel.execute("persionValue", args);
});