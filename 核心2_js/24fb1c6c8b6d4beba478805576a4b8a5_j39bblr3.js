viewModel.on("afterLoadMeta", (args) => {
  const { vm, view } = args;
  cb.cache.set("viewModel", vm);
});
viewModel.on("afterMount", () => {
  loadStyle();
});
//点击tab切换标签获取标签值
viewModel.on("afterTabActiveKeyChange", function (info) {
  const { key } = info;
  let vm = cb.cache.get("viewModel");
  switch (key) {
    case "tabpane6oi":
      // 待发布
      cb.cache.set("checkBillStatus", "1");
      break;
    case "tabpane24mf":
      // 内审中
      cb.cache.set("checkBillStatus", "4");
      break;
    case "tabpane33le":
      // 已生效
      cb.cache.set("checkBillStatus", "5");
      break;
    case "tabpane54jd":
      // 全部
      cb.cache.set("checkBillStatus", "7");
      break;
    default:
      console.log("default");
  }
  const filtervm = viewModel.getCache("FilterViewModel");
  filtervm.get("search").execute("click", { model: viewModel, solutionid: filtervm.getCache("schemeId") });
});
viewModel.on("beforeSearch", function (args) {
  let checkBillStatus = "1";
  if (cb.cache.get("checkBillStatus")) {
    checkBillStatus = cb.cache.get("checkBillStatus");
  }
  //筛选对应单据状态数据
  if (checkBillStatus === "7") return;
  args.isExtend = true;
  commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "checkBillStatus",
    op: "eq",
    value1: checkBillStatus
  });
});
//加载自定义样式 (无异步、css不生效问题，效果好)
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
    .hide-tabs {display: none}
    `;
  headobj.appendChild(style);
}
viewModel.get("button24fc") &&
  viewModel.get("button24fc").on("click", function (data) {
    // 测试NCC--单击
    cb.rest.invokeFunction("AT16F3BEFC09B8000B.backOpenApiFunction.HX1676529820", {}, function (err, res) {
      debugger;
    });
  });