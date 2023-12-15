viewModel.get("button22jd") &&
  viewModel.get("button22jd").on("click", function (data) {
    // 数据拉取--单击
    cb.utils.loadingControl.start(); //开启一次loading
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    let makeTimeStart = filterViewModelInfo.get("makedate").getFromModel().getValue(); //单据日期
    let makeTimeEnd = filterViewModelInfo.get("makedate").getToModel().getValue(); //单据日期
    let codenumber = filterViewModelInfo.get("codenumber").getFromModel().getValue(); //入库调整单号
    let result = cb.rest.invokeFunction("AT19899ED209780001.rukujiekou.recDocuApi", { codenumber: codenumber, makeTimeStart: makeTimeStart, makeTimeEnd: makeTimeEnd }, function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
        cb.utils.loadingControl.end(); //关闭一次loading
        return;
      } else {
        //获取搜索模型后，使用fireEvent方法触发搜索模型上的点击事件
        viewModel.getCache("FilterViewModel").get("search").fireEvent("click");
        cb.utils.loadingControl.end(); //关闭一次loading
        cb.utils.alert("数据同步更新成功", "info");
      }
    });
  });
viewModel.on("afterMount", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  filterViewModelInfo.on("afterInit", function () {
    let startdtNow = new Date();
    startdtNow.setTime(startdtNow.getTime() - 30 * 24 * 60 * 60 * 1000); //当天日期减1天，天*小时*分钟*秒*毫秒
    let makeTimeStart = startdtNow.format("yyyy-MM-dd");
    filterViewModelInfo.get("makedate").getFromModel().setValue(makeTimeStart);
    filterViewModelInfo.get("makedate").getToModel().setValue(new Date().format("yyyy-MM-dd"));
  });
});
viewModel.on("beforeSearch", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  //查询区afterResetClick事件，放在页面模型的afterMount和beforeSearch事件中可以生效
  filterViewModelInfo.on("afterResetClick", function (data) {
    let startdtNow = new Date();
    startdtNow.setTime(startdtNow.getTime() - 30 * 24 * 60 * 60 * 1000); //当天日期减1天，天*小时*分钟*秒*毫秒
    let makeTimeStart = startdtNow.format("yyyy-MM-dd");
    filterViewModelInfo.get("makedate").getFromModel().setValue(makeTimeStart);
    filterViewModelInfo.get("makedate").getToModel().setValue(new Date().format("yyyy-MM-dd"));
    //在这个钩子里返回false的话可以阻止后续的搜索动作(默认为true)
    return false;
  });
});