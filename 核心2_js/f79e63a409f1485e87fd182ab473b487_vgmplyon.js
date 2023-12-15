viewModel.on("afterInit", (args) => {
  cb.cache.set("swiftTab", "1");
  // 获取全部价值观
  cb.rest.invokeFunction("AT165369EC09000003.apifunc.PPUserGetStaff", {}, function (err, res) {
    if (res) {
      cb.cache.set("StaffId", res.userMsg.staffId);
      cb.rest.invokeFunction("AT165369EC09000003.apifunc.ValuesDataQry", { staffId: res.userMsg.staffId }, function (err, res) {
        viewModel.execute("setRadaValue", res);
      });
    }
  });
});
viewModel.on("beforeSearch", function (data) {
  // 个人积分--页面初始化
  let staffId = cb.cache.get("StaffId");
  let swiftTab = cb.cache.get("swiftTab");
  data.isExtend = true;
  commonVOs = data.params.condition.commonVOs;
  commonVOs.push(
    {
      itemName: "staff",
      op: "eq",
      value1: staffId
    },
    {
      itemName: "values_type",
      op: "eq",
      value1: swiftTab
    }
  );
  cb.rest.invokeFunction(
    "AT165369EC09000003.apifunc.ValuesScoreQry",
    {
      staffId: staffId,
      valuesId: swiftTab
    },
    function (err, res) {
      viewModel.execute("setScoreValue", res.data);
    }
  );
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\34 5e6b4a0MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_45e6b4a0MobileList > div.am-flexbox.yonui-mobile-flex-runtime.undefined.am-flexbox-dir-row.am-flexbox-align-center"
  ).style.display = "none";
});
viewModel.getGridModel().on("afterSetDataSource", (args) => {
  debugger;
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\34 5e6b4a0MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_45e6b4a0MobileList > div:nth-child(3)"
  ).style.display = "none";
  document.getElementsByClassName("sticky-container-wrapper")[0].style.display = "none";
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\34 5e6b4a0MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_45e6b4a0MobileList > div:nth-child(4)"
  ).style.display = "none";
  document.querySelector(
    "#container > div > div.meta-dynamic-view.\\34 5e6b4a0MobileList.developplatform > div.meta-container.height-100 > div > div.am-tabs-content-wrap > div > div > div > div.subpage.active > div > div > div.group-container.page.YYList.developplatform_45e6b4a0MobileList > div.ys-footer.fixed-element.isDesign"
  ).style.display = "none";
});
viewModel.on("afterTabActiveKeyChange", ({ key }) => {
  debugger;
  let index = key.split("_")[1];
  cb.cache.set("swiftTab", index);
  viewModel.getCache("FilterViewModel").get("search").fireEvent("click", {});
});