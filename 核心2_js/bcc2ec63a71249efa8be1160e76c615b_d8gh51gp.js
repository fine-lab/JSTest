viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 生成--单击
    var zuofeiyuanyinValue = viewModel.get("yuanyin").getValue(); //原因
    if (zuofeiyuanyinValue == null) {
      cb.utils.alert("作废原因不可为空！", "error");
      return false;
    }
    var rows = viewModel.getParams().rows;
    var nowTime = getZfTime();
    var parentViewModel = viewModel.getCache("parentViewModel");
    var nowTime = getZfTime();
    for (var i = 0; i < rows.length; i++) {
      var selectData = rows[i];
      var yangbenbianhao = selectData.yangbenbianhao;
      var dataRes = cb.rest.invokeFunction("AT15F164F008080007.sampleRece.queryRecDetil", { idnum: selectData.id }, function (err, res) {}, viewModel, { async: false });
      if (dataRes.error) {
        cb.utils.alert("样本【" + yangbenbianhao + "】查询数据异常：" + dataRes.error.message);
        //属性父model页面
        parentViewModel.execute("refresh");
        //关闭模态框
        viewModel.communication({ type: "modal", payload: { data: false } });
        return false;
      }
      var bodyData = dataRes.result.bodyRes[0];
      if ("30" != bodyData.zhuangtai) {
        //非已收样状态
        cb.utils.alert("样本【" + yangbenbianhao + "】状态为非已收样!");
        //属性父model页面
        parentViewModel.execute("refresh");
        //关闭模态框
        viewModel.communication({ type: "modal", payload: { data: false } });
        return false;
      } else if ("00" != bodyData.checkStatus && "05" != bodyData.checkStatus) {
        //自检样本检测未完成
        cb.utils.alert("样本【" + yangbenbianhao + "】存在下游检测订单!");
        //属性父model页面
        parentViewModel.execute("refresh");
        //关闭模态框
        viewModel.communication({ type: "modal", payload: { data: false } });
        return false;
      } else {
        var updateRes = cb.rest.invokeFunction(
          "AT15F164F008080007.sampleRece.zfButton",
          { bodyData: bodyData, nowTime: nowTime, zuofeiyuanyinValue: zuofeiyuanyinValue },
          function (err, res) {},
          viewModel,
          { async: false }
        );
        if (updateRes.error) {
          cb.utils.alert("【" + yangbenbianhao + "】作废失败:" + updateRes.error.message);
          //属性父model页面
          parentViewModel.execute("refresh");
          //关闭模态框
          viewModel.communication({ type: "modal", payload: { data: false } });
          return false;
        }
      }
    }
    cb.utils.alert("批量作废成功!");
    //属性父model页面
    parentViewModel.execute("refresh");
    //关闭模态框
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
function getZfTime() {
  var date = new Date();
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds(); //秒
  hour = hour > 9 ? hour : "0" + hour;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  var nowTime = hour + ":" + minutes + ":" + seconds;
  return nowTime;
}
viewModel.get("btnAbandon") &&
  viewModel.get("btnAbandon").on("click", function (data) {
    // 取消--单击
    //关闭模态框
    viewModel.communication({ type: "modal", payload: { data: false } });
  });