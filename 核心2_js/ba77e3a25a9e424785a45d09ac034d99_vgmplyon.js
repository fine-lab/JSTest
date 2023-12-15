viewModel.on("beforeSearch", function (data) {
  // 个人积分--页面初始化
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\30 537ab39MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_0537ab39MobileList > div.am-flexbox.yonui-mobile-flex-runtime.undefined.am-flexbox-dir-row.am-flexbox-align-center"
  ).style.display = "none";
});
viewModel.getGridModel().on("afterSetDataSource", (args) => {
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\30 537ab39MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_0537ab39MobileList > div.ys-footer.fixed-element.isDesign"
  ).style.display = "none";
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\30 537ab39MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_0537ab39MobileList > div:nth-child(3) > div.ys-listview-filter-drawer.filter-drawer.ys-listview-scroll.am-drawer.am-drawer-bottom > div.am-drawer-content > div.sticky-container-wrapper > div > div.sticky.sum-sticky > div"
  ).style.display = "none";
});