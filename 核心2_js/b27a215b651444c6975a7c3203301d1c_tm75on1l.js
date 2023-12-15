function pageInfo(viewModel, reqParams) {
  var params = viewModel.getParams();
  var options = {
    domainKey: params.domainKey
  };
  console.log("*************************");
  console.log("[method]" + JSON.stringify(options));
  console.log(reqParams);
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "/learning/plan/student/list?page=" + (reqParams.page ? reqParams.page : 1) + "&pageSize=" + (reqParams.pageSize ? reqParams.pageSize : 10),
      method: "post",
      tenant_id: "youridHere",
      options: options
    }
  });
  proxy.settle(reqParams, function (err, res) {
    if (err) {
      console.log(err);
      cb.utils.alert(err.message);
      return;
    } else {
      console.log(res);
      var gridModel = viewModel.getGridModel();
      var pageNow = viewModel.pageNow;
      var pageSizeNow = viewModel.pageSizeNow;
      var list = res.list;
      for (var i = 0, len = list.length; i < len; i++) {
        var total_rate = list[i].rate_avg ? list[i].rate_avg : 0;
        list[i].total_rate = total_rate + "%";
      }
      gridModel.setState("dataSourceMode", "local");
      gridModel.setDataSource(list);
      gridModel.setPageInfo({
        pageSize: pageSizeNow,
        pageIndex: pageNow,
        recordCount: res.total
      });
    }
  });
}
viewModel.on("customInit", function (data) {
  console.log("[--页面初始化---]");
  var gridModel = viewModel.getGridModel();
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  var userId = viewModel.getAppContext().user.userId;
  var pageNow = viewModel.pageNow;
  var pageSizeNow = viewModel.pageSizeNow;
  var name = "";
  var start_time = "";
  var end_time = "";
  var code = "";
  viewModel.selectedData = [];
  viewModel.getParams().autoLoad = false;
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
        name: name,
        code: code,
        start_time: start_time,
        end_time: end_time,
        page: viewModel.pageNow,
        pagesize: viewModel.pageSizeNow
      };
      pageInfo(viewModel, reqParams);
    });
    var reqParams = {};
    pageInfo(viewModel, reqParams);
    // 查询区搜索---kw
    viewModel.on("beforeSearch", function () {
      console.log("[beforeSearch]");
      name = filtervm.get("name").getFromModel().getValue();
      code = filtervm.get("code").getFromModel().getValue();
      start_time = filtervm.get("start_time").getFromModel().getValue();
      end_time = filtervm.get("end_time").getFromModel().getValue();
      var reqParams = {
        tenant_id: tenantID,
        userId: userId,
        // 查询区参数
        name: name,
        code: code,
        start_time: start_time,
        end_time: end_time,
        page: viewModel.pageNow,
        pagesize: viewModel.pageSizeNow
      };
      pageInfo(viewModel, reqParams);
      return false;
    });
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
      page: viewModel.pageNow,
      pagesize: viewModel.pageSizeNow
    };
    pageInfo(viewModel, reqParams);
  });
});