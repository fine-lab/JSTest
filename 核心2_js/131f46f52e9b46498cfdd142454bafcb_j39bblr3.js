let gridList = [];
viewModel.on("afterLoadMeta", (args) => {
  const { vm, view } = args;
  cb.cache.set("viewModel1", vm);
});
viewModel.on("beforeSearch", function (args) {
  debugger;
  if (cb.cache.get("viewModel2")) {
    let vm2 = cb.cache.get("viewModel2");
    vm2.execute("viewModel2filter", { args });
  }
});
viewModel.on("afterTabActiveKeyChange", function (info) {
  const { key } = info;
  switch (key) {
    case "tabpane6se":
      // 待发布
      filterSearch.checkBillStatus = "1";
      break;
    case "":
      // 待供应商确认
      break;
    default:
    // 待发布
  }
  debugger;
  if (cb.cache.get("viewModel2")) {
    let vm2 = cb.cache.get("viewModel2");
    vm2.execute("viewModel2filter", { filterSearch });
  }
});
const filterData = (data, status) => {
  const list = data.filter((item) => {
    return item.checkBillStatus == status;
  });
  return list;
};
const gridModel = viewModel.getGridModel();
gridModel.on("beforeSetDataSource", (data) => {
  debugger;
});