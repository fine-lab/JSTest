viewModel.get("button13bj") &&
  viewModel.get("button13bj").on("click", function (data) {
    // 校验测试--单击
  });
viewModel.on("customInit", function (data) {
  // 供应商联系人详情--页面初始化
});
viewModel.get("shoujihao") &&
  viewModel.get("shoujihao").on("afterValueChange", function (data) {
    // 手机号--值改变后
    const value = viewModel.get("shoujihao").getValue();
    alert("手机号的值是：" + value);
    if (value.indexOf("131") === 4) {
      alert("确定是131的手机号吗？");
    } else {
      alert("确定不是131的手机号吗？");
    }
  });