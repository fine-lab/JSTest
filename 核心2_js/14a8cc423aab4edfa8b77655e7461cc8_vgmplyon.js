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
  .ys-button.ys-button-small {
    display: none !important;
  }
  .Modal-DetailItemInfo .ys-footer.isDesign, .am-tabs-pane-wrap-active .ys-footer.isDesign, .ys-drawer-open .ys-drawer-content .ys-footer.isDesign {
    display: none;
  }
  .group-container>div:nth-child(2) {
    display: none;
  }
  .ys-listview-filter-drawer .am-drawer-content .sticky-container-wrapper .sum-sticky .ys-list-view-total {
      display: none !important;
    }
  `;
  headobj.appendChild(style);
}