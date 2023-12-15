viewModel.get("button41oa") &&
  viewModel.get("button41oa").on("click", function (data) {
    //批改--单击
    debugger;
    //传递给被打开页面的数据信息
    let isBiaotou = viewModel.get("sumSwitch").getValue();
    let selectData = viewModel.getGridModel().getSelectedRows();
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    let filterModelInfo = filterViewModelInfo.get("st_salesoutlist_abstract");
    let pgdata = {
      billtype: "Voucher", // 单据类型
      billno: "yb17be2275", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态browse)
        isSource: "xsck", //数据来源
        isBiaotou: isBiaotou, //选中的数据是表头还是表头+明细
        selectData: selectData //选中的数据
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", pgdata, viewModel);
  });