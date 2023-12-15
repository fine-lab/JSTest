viewModel.on("customInit", function (data) {
  // 物返报表--页面初始化
  let URL = window.location.href;
  let urldata = getUrlParams3(URL);
  let agentCode = urldata.agentCode;
  let agentname = "";
  let result = cb.rest.invokeFunction("SCMSA.saleOrderRule.getToken", {}, function (err, res) {}, viewModel, { async: false });
  let accessToken = result.result.access_token;
  const url = "https://www.example.com/"; // 添加domainKey防止跨域
  var proxy = viewModel.setProxy({
    ensure: {
      url: url,
      method: "GET",
      options: {
        async: false
      }
    }
  });
  //拼接接口入参
  var params = {
    access_token: accessToken,
    code: agentCode
  };
  debugger;
  //调用接口后执行的操作
  let res = proxy.ensure(params, function (err, result) {});
  if (!res.error) {
    agentname = res.result.name.zh_CN;
  }
  //设置查询区的默认值
  viewModel.on("afterMount", function () {
    let { oid, oSupplierId, oSupplierName } = viewModel.getParams();
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      //如果客户编码为空，让所属分销商可以编辑
      if (agentname !== "") {
        filtervm.get("ssfxs").getFromModel().setDisabled(true);
      }
      // 赋予搜索区字段初始值
      filtervm.get("ssfxs").getFromModel().setValue(agentname);
    });
  });
});
function getUrlParams3(url) {
  let pattern = /(\w+|[\u4e00-\u9fa5]+)=(\w+|[\u4e00-\u9fa5]+)/gi;
  let result = {};
  url.replace(pattern, ($, $1, $2) => {
    result[$1] = $2;
  });
  return result;
}
viewModel.getGridModel().on("afterSetDataSource", function (data) {
  let b = viewModel.getCache("remark");
  let gridModel = viewModel.getGridModel();
  if (!b) {
    let pageIndex = gridModel.getPageIndex();
    let pageSize = gridModel.getPageSize();
    const filtervm = viewModel.getCache("FilterViewModel");
    let agentCode = filtervm.get("ssfxs").getFromModel().getValue();
    let materialCode = filtervm.get("materialCode").getFromModel().getValue();
    let materialName = filtervm.get("materialName").getFromModel().getValue();
    let meaname = filtervm.get("dw").getFromModel().getValue();
    let wlbillno = filtervm.get("numbers").getFromModel().getValue();
    let res = [];
    let obj = cb.rest.invokeFunction(
      "GT80750AT4.wf.getWfsjapi",
      {
        pageIndex: pageIndex,
        pageSize: pageSize,
        agentCode: agentCode,
        materialCode: materialCode,
        materialName: materialName,
        meaname: meaname,
        wlbillno: wlbillno
      },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    let total = obj.result.total;
    viewModel.setCache("remark", 1);
    gridModel.setState("dataSourceMode", "local");
    gridModel.setDataSource(obj.result.data);
    gridModel.setPageInfo({
      pageSize: pageSize,
      pageIndex: pageIndex,
      recordCount: total
    });
  } else {
    viewModel.clearCache("remark");
  }
});
let cureepage = 1;
viewModel.getGridModel().on("beforeLoad", function (data) {
  if (event.target.id == "111010480searchicon") {
    viewModel.getGridModel().setPageIndex(1);
  }
});