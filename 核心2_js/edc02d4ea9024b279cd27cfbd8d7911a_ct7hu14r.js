viewModel.on("customInit", function (data) {
  // 盘点结果列表--页面初始化
  console.log("[盘点结果列表]");
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  console.log(viewModel);
  console.log(viewModel.getParams());
  // 获取token
  viewModel.getParams().autoLoad = false;
  var gridModel = viewModel.getGridModel();
  let btnModalConfirm = viewModel.get("btnModalConfirm");
  let handleBtn = viewModel.get("button3xg");
  let checkTaskInfo = viewModel.getParams().checkTaskInfo;
  if (typeof checkTaskInfo == "undefined") return;
  let checkID = checkTaskInfo.id;
  var checkLocationNameNow = "";
  var productNameNow = "";
  var productUnitNow = "";
  var stockUnitNameNow = "";
  var checkStatusNow = "";
  var scanWayNow = "";
  var productskuNameNow = "";
  var pageNow = 1;
  var pageSizeNow = 10;
  //真实请求接口获取表格数据
  viewModel.on("afterMount", function () {
    viewModel.getCache("FilterViewModel").getParams().filterRows = 3;
    console.log("[afterMount]");
    console.log(viewModel.get("btnModalConfirm"));
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    console.log(filtervm);
    //查询区模型DOM初始化后
    filtervm.on("afterInit", function () {
      console.log("[afterInit]");
      gridModelReload(1, pageSizeNow);
      viewModel.on("beforeSearch", function (params) {
        console.log("检索数据");
        console.log(typeof filtervm.get("checkLocationName").getFromModel);
        var checkLocationNameValue = filtervm.get("checkLocationName").getFromModel().getValue();
        var productNameValue = filtervm.get("productName").getFromModel().getValue();
        var productUnitValue = filtervm.get("productunit").getFromModel().getValue();
        var stockUnitNameValue = filtervm.get("stockunitname").getFromModel().getValue();
        var checkStatusValue = filtervm.get("checkstatus").getFromModel().getValue();
        var scanWayValue = filtervm.get("scanWay").getFromModel().getValue();
        var productskuNameValue = filtervm.get("productskuName").getFromModel().getValue();
        checkLocationNameNow = checkLocationNameValue === undefined || checkLocationNameValue === null ? "" : checkLocationNameValue;
        productNameNow = productNameValue === undefined || productNameValue === null ? "" : productNameValue;
        productUnitNow = productUnitValue === undefined || productUnitValue === null ? "" : productUnitValue;
        stockUnitNameNow = stockUnitNameValue === undefined || stockUnitNameValue === null ? "" : stockUnitNameValue;
        checkStatusNow = checkStatusValue === undefined || checkStatusValue === null ? "" : checkStatusValue;
        scanWayNow = scanWayValue === undefined || scanWayValue === null ? "" : scanWayValue;
        productskuNameNow = productskuNameValue === undefined || productskuNameValue === null ? "" : productskuNameValue;
        pageNow = 1;
        gridModelReload(1, pageSizeNow);
        return false;
      });
    });
  });
  gridModel.on("pageInfoChange", function () {
    //获取当前页码
    var pageIndex = gridModel.getPageIndex();
    //获取当前页条数
    var pageSize = gridModel.getPageSize();
    pageNow = pageIndex;
    pageSizeNow = pageSize;
    gridModelReload(pageIndex, pageSize);
  });
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        actionState[action.cItemName] = { visible: false };
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
  handleBtn.on("click", function (args) {
    const checkResultInfo = gridModel.getRow(args.index);
    var params = viewModel.getParams();
    var reqParams = {
      domainKey: params.domainKey,
      checkid: checkID,
      checklocationname: checkLocationNameNow,
      productname: productNameNow,
      productunit: productUnitNow,
      stockunitname: stockUnitNameNow,
      checkstatus: checkStatusNow,
      scanWay: scanWayNow,
      productskuname: productskuNameNow,
      page: pageNow,
      pagesize: pageSizeNow
    };
    let data = {
      billtype: "VoucherList", // 单据类型
      billno: "e33f8f2c", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        checkResultInfo: checkResultInfo,
        reqParams: reqParams,
        page: pageNow,
        pageSize: pageSizeNow
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });
  function gridModelReload(page, pageSize) {
    console.log("[gridModelReload]");
    var params = viewModel.getParams();
    var reqParams = {
      tenant_id: tenantID,
      checkid: checkID,
      checklocationname: checkLocationNameNow,
      productname: productNameNow,
      productunit: productUnitNow,
      stockunitname: stockUnitNameNow,
      checkstatus: checkStatusNow,
      scanWay: scanWayNow,
      productskuname: productskuNameNow,
      page: page,
      pagesize: pageSize
    };
    var ListResult = cb.rest.invokeFunction("317125ce944242109f940225e63b8529", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
    console.log(ListResult);
    const res = JSON.parse(ListResult.result.strResponse);
    if (res.status === "1" || res.status === 1) {
      gridModel.setState("dataSourceMode", "local");
      gridModel.setDataSource(res.dataList);
      gridModel.setPageInfo({
        pageSize: pageSize,
        pageIndex: page,
        recordCount: res.totalSize
      });
    } else {
      cb.utils.alert("系统出错!");
      return;
    }
  }
});
viewModel.get("button14kb") &&
  viewModel.get("button14kb").on("click", function (data) {
    // 返回--单击
  });