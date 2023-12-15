// 国立测试 - qyupdateProduct
// 当点击 button16gc 按钮时触发的事件
viewModel.get("button16gc").on("click", (args) => {
  // 调用后台接口 AT16ACB41608F0000B.apiTest.updateData  更新需求产品
  cb.rest.invokeFunction("AT16ACB41608F0000B.apiTest.qyupdateData", {}, function (err, res) {
    // 如果发生错误
    if (err) {
      // 弹出提示框显示“已更新完成”
      cb.utils.alert("已更新完成");
    }
  });
});
// 每 40 秒执行一次的定时器
setInterval(function () {
  // 每隔一段时间调用后台接口 AT16ACB41608F0000B.apiTest.updateData
  cb.rest.invokeFunction("AT16ACB41608F0000B.apiTest.qyupdateData", {}, function (err, res) {
    // 输出更新成功信息到控制台
    console.log("更新成功：=====" + res.res.length);
  });
}, 40000);