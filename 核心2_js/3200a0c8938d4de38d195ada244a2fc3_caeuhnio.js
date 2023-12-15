viewModel.on("customInit", function (data) {
  // 测试人员3新--页面初始化
  var viewModel = this;
  // 测试人员3新--页面初始化
  console.log("测试人员3新--页面初始化");
  //不走标准返回 获取一下当前页面的 page信息还有查询查询讯息
  viewModel.on("beforeSearch", function (args) {
    let { pageIndex, pageSize } = viewModel.getGridModel().get("pageInfo");
    let pageInfo = { pageIndex, pageSize };
    if (viewModel.getGridModel().getAllData().length == 0) {
      pageInfo.pageIndex = pageInfo.pageIndex > 1 ? 1 : pageInfo.pageIndex;
    }
    if (args?.params?.condition?.commonVOs.length >= 3) {
      let params = {};
      args?.params?.condition?.commonVOs.slice(2, args?.params?.condition?.commonVOs.length).forEach((element) => {
        params[element.itemName] = element.value1;
      });
      pageInfo.params = params;
    }
    getList(pageInfo);
    return false;
  });
  function getList(pageInfo) {
    cb.rest.invokeFunction("AT169D355408F00002.testKAIFAAPI.getlistData3", { pageInfo }, function (err, res) {
      if (res) {
        if (res.code == 200) {
          let { pageIndex, pageSize } = pageInfo;
          viewModel.getGridModel().setState("dataSourceMode", "local");
          if (res.res.length < 10) {
            pageSize = 10;
          }
          viewModel.getGridModel().setPageInfo({
            recordCount: res.res.length,
            pageIndex,
            pageSize
          });
          viewModel.getGridModel().setDataSource(res.res);
          viewModel.getGridModel().setState("dataSourceMode", "remote");
        } else {
          viewModel.getGridModel().setState("dataSourceMode", "local");
          viewModel.getGridModel().setDataSource(undefined);
          viewModel.getGridModel().setState("dataSourceMode", "remote");
          cb.utils.alert(res.message);
        }
      }
    });
  }
  viewModel.on("afterBatchdelete", function (res) {
    viewModel.execute("refresh");
  });
});