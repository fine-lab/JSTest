viewModel.on("afterLoadMeta", (args) => {
  const { vm, view } = args;
  cb.cache.set("viewModel2", vm);
});
viewModel.on("afterMount", function () {
  let vm = cb.cache.get("viewModel2");
  // 获取查询区模型
  vm.on("viewModel2filter", function (data) {
    vm.getCache("FilterViewModel").get("search").fireEvent("click", {});
    cb.cache.set("searchFilter", data.filterSearch);
  });
});
viewModel.on("beforeSearch", function (args) {
  debugger;
  args.isExtend = true;
  let data = cb.cache.get("searchFilter");
  if (data) {
    commonVOs = args.params.condition.commonVOs;
    for (let key in data) {
      if (data[key].value1) {
        commonVOs.push({
          itemName: key,
          op: "eq",
          value1: data[key].value1
        });
      }
    }
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
viewModel.getGridModel().on("beforeLoad", (data) => {
  let vm = cb.cache.get("viewModel2");
  vm.get("btnBizFlowBatchPush").setVisible(false);
  vm.get("011425d39000463598c545e8b2be4195");
  document.getElementsByClassName("listHeadRow")[1].style.display = "none";
  document.getElementsByClassName("listHeadRow")[2].style.display = "none";
  document.getElementsByClassName("listHeadRow")[3].style.display = "none";
  document.getElementsByClassName("listHeadRow")[4].style.display = "none";
  document.getElementsByClassName("listHeadRow")[5].style.display = "none";
  document.getElementsByClassName("listHeadRow")[6].style.display = "none";
  document.getElementsByClassName("listHeadRow")[7].style.display = "none";
});
viewModel.getGridModel() &&
  viewModel.getGridModel().on("dblClick", function (data) {
    let vm = cb.cache.get("viewModel2");
    let data2 = {
      billtype: "Voucher", // 单据类型
      billno: "yb34a1589b", // 单据号
      params: {
        readOnly: true, // 预览时，一定为true，否则不加载详情数据
        mode: "browse", // 须传mode + 单据id + readOnly:false
        id: data.id
      }
    };
    cb.loader.runCommandLine("bill", data2, vm);
  });
viewModel.get("btnEdit") &&
  viewModel.get("btnEdit").on("click", function (data) {
    // 编辑--单击
    let vm = cb.cache.get("viewModel2");
    let data2 = {
      billtype: "Voucher", // 单据类型
      billno: "yb34a1589b", // 单据号
      params: {
        readOnly: false,
        mode: "edit",
        id: data.id4ActionAuth
      }
    };
    cb.loader.runCommandLine("bill", data2, vm);
  });