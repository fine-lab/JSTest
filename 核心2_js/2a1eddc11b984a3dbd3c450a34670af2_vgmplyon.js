viewModel.on("afterInit", (args) => {
  cb.rest.invokeFunction("AT165369EC09000003.apifunc.PPUserGetStaff", {}, function (err, res) {
    if (err) {
      cb.utils.alert("查询人员信息错误!");
    }
    if (res) {
      cb.cache.set("StaffId", res.userMsg.staffId);
    }
  });
});
viewModel.on("beforeSearch", function (data) {
  // 个人积分--页面初始化
  let staffId = cb.cache.get("StaffId");
  data.isExtend = true;
  commonVOs = data.params.condition.commonVOs;
  commonVOs.push({
    itemName: "staff",
    op: "eq",
    value1: staffId
  });
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\33 029bd38MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_3029bd38MobileList > div.am-flexbox.yonui-mobile-flex-runtime.undefined.am-flexbox-dir-row.am-flexbox-align-center"
  ).style.display = "none";
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
  .sum-sticky{
    display:none;
  }
  .isDesign{
    display:none;
  }
  .list-view-section-body{
    display:flex;
    flexFlow :row wrap;
  }
  .am-list-body{
    display:none;
  }
  .Modal-DetailItemInfo .ys-footer.isDesign, .am-tabs-pane-wrap-active .ys-footer.isDesign, .ys-drawer-open .ys-drawer-content .ys-footer.isDesign
  {
    display:none;
  }
  `;
  headobj.appendChild(style);
}
viewModel.getGridModel().on("afterSetDataSource", (args) => {
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\33 029bd38MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_3029bd38MobileList > div:nth-child(3)"
  ).style.display = "none";
});
viewModel.on("afterLoadMeta", (args) => {
  const { view, vm } = args;
  debugger;
  cb.cache.set("thisViewModel", vm);
});
viewModel.getGridModel().on("beforeSetDataSource", (args) => {
  let vm = cb.cache.get("thisViewModel");
  vm.execute("getData", args);
  vm.execute("getTree", args);
});