function pageInfo(viewModel, reqParams) {
  var params = viewModel.getParams();
  var options = {
    domainKey: params.domainKey
  };
  console.log("*************************");
  console.log("[method]" + JSON.stringify(options));
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "/learning/plan/student/list?pageIndex=1&pageSize=10",
      method: "get",
      tenant_id: tenantID,
      options: options
    }
  });
  proxy.settle(reqParams, function (err, res) {
    if (err) {
      console.log(err);
      cb.utils.alert(err.message);
      return;
    } else {
      debugger;
      if (res.status === "1" || res.status === 1) {
        gridModel.setState("dataSourceMode", "local");
        gridModel.setDataSource(res.dataList);
        gridModel.setPageInfo({
          pageSize: pageSizeNow,
          pageIndex: pageNow,
          recordCount: res.totalSize
        });
      } else {
        cb.utils.alert("系统出错!");
      }
    }
  });
}
viewModel.on("customInit", function (data) {
  // 测试kw--页面初始化
  console.log("[测试kw--页面初始化]");
  var gridModel = viewModel.getGridModel();
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  var userId = viewModel.getAppContext().user.userId;
  var pageNow = viewModel.pageNow;
  var pageSizeNow = viewModel.pageSizeNow;
  viewModel.selectedData = [];
  viewModel.getParams().autoLoad = false;
  debugger;
  viewModel.on("afterMount", function () {
    console.log("aftermount");
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filtervm.on("afterInit", function () {
      console.log("[afterInit]");
      var reqParams = {
        tenant_id: tenantID,
        userId: userId,
        org_id: orgIDNow,
        page: viewModel.pageNow,
        pagesize: viewModel.pageSizeNow
      };
      pageInfo(viewModel, reqParams);
    });
    var reqParams = {};
    pageInfo(viewModel, reqParams);
  });
  gridModel.on("pageInfoChange", function () {
    //获取当前页码
    var pageIndex = gridModel.getPageIndex();
    //获取当前页条数
    var pageSize = gridModel.getPageSize();
    viewModel.pageNow = pageIndex;
    viewModel.pageSizeNow = pageSize;
    var reqParams = {
      tenant_id: tenantID,
      userId: userId,
      org_id: orgIDNow,
      page: viewModel.pageNow,
      pagesize: viewModel.pageSizeNow
    };
    pageInfo(viewModel, reqParams);
  });
});