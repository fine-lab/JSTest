viewModel.get("button33bi") &&
  viewModel.get("button33bi").on("click", function (data) {
    // 完工--单击
    let index = viewModel.getGridModel().getFocusedRowIndex();
    let rowData = viewModel.getAllData().pes_sos_install_list[index];
    let res = {
      billtype: "VoucherList", // 单据类型
      billno: "72c63160", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        pass_contract_code: rowData.extend_contract_code
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", res, viewModel);
  });
viewModel.on("customInit", function (data) {
  // 安装工单列表--页面初始化
});
cb.rest.invokeFunctionExtend = function (id, data, callback, viewModel, options) {
  if (!options) {
    var options = {};
    options.domainKey = cb.utils.getActiveDomainKey();
  }
  if (options.domainKey == null && viewModel != undefined) {
    options.domainKey = viewModel.getDomainKey();
  }
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  if (options.async == false) {
    return proxy.doProxy(data, callback);
  } else {
    proxy.doProxy(data, callback);
  }
};
viewModel.get("btnBatchCompleteConfirm") &&
  viewModel.get("btnBatchCompleteConfirm").on("click", function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    var dateStr = `${year}-${month}-${day}`;
    const params = viewModel.getParams();
    params.dateStr = dateStr;
    cb.rest.invokeFunctionExtend(
      "IMP_PES.openApi.nowTime",
      { params: params },
      function (err, res) {
        if (err != null) {
          cb.utils.alert(err);
        } else {
          cb.utils.alert("已确认完工时间");
          console.log(JSON.stringify(res));
        }
      },
      viewModel,
      { domainKey: "yourKeyHere" }
    );
  });
viewModel.get("button36yi") &&
  viewModel.get("button36yi").on("click", function (data) {
    // 按钮11--单击
    cb.rest.invokeFunctionExtend(
      "IMP_PES.DemoFunction.postmanDemo",
      {},
      function (err, res) {
        debugger;
      },
      viewModel,
      { domainKey: "yourKeyHere" }
    );
  });