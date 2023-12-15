//列表下推前  beforeBizflowpush
//列表下推后 afterBizflowpush
viewModel.on("afterBizflowpush", function (data) {
  debugger;
  sleep(8000);
  viewModel.biz.do("refresh", viewModel);
});
viewModel.on("afterLoadData", function (data) {
  // 授信审批开立详情--页面初始化 afterLoadData customInit
  debugger;
  let optionAllXiShu = { async: false };
  let inData = { xx: "xx" };
  let resXIShuAll = cb.rest.invokeFunction("18862c5671234edd81cea94ab089a79a", inData, null, viewModel, optionAllXiShu);
  let shangnianshijixiaoshoue = resXIShuAll.result.shangnianshijixiaoshoue;
  let shangyinianfahuojine = resXIShuAll.result.shangyinianfahuojine;
  viewModel.get("shangnianshijixiaoshoue").setValue(shangnianshijixiaoshoue);
  viewModel.get("shangyinianfahuojine").setValue(shangyinianfahuojine);
});
viewModel.get("zhongzhiriqi") &&
  viewModel.get("zhongzhiriqi").on("afterValueChange", function (data) {
    // 授信终止日期--值改变后
    const kaishiriqi = viewModel.get("kaishiriqi").getValue();
    const zhongzhiriqi = viewModel.get("zhongzhiriqi").getValue();
    if (zhongzhiriqi < kaishiriqi) {
      viewModel.get("zhongzhiriqi").setValue(null);
    }
  });