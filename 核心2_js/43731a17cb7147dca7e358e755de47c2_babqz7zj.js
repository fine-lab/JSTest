viewModel.on("customInit", function (data) {
  // 退库申请详情详情--页面初始化
});
viewModel.on("beforeSave", function (data) {
  //事件发生之前，可以进行特色化处理，以此为例，可以进行保存之前数据校验，通过return true;否则return false;
  console.log(data);
  //获取子表集合
  var mainJson = data.data.data;
  const main = JSON.parse(mainJson);
  const details = main.tksq_bList;
  for (var i = 0; i < details.length; i++) {
    debugger;
    var obj = details[i];
    //可退款数量+已退款数量不能大于总数量
    if (obj.num - (obj.tknum + obj.yituikuanshuliang) < 0) {
      //返回提示信息
      cb.utils.alert("第" + (i + 1) + "行退库数量超出最大范围", "error");
      return false;
    }
  }
});