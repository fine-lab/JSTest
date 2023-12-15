viewModel.on("customInit", function (data) {
  // 脚本验证01详情--页面初始化
  cb.utils.alert({
    title: "我是标题", // 弹窗文本内容
    type: "info", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
    duration: "5", // 自动关闭的延时，单位秒
    mask: true, // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
    onClose: function () {
      cb.utils.confirm({
        title: "弹窗标题", // String 或 React.Element
        message: "弹窗内容", // String 或 React.Element
        actions: "", // 按钮组, {text, onPress, style}, 值为数组。不传该参数显示默认的确定取消。传 [] 则不显示操作按钮
        okFunc: () => {
          console.log("确定回调");
        },
        cancelFunc: () => {
          console.log("取消回调");
        }
      });
    } // 关闭后回调
  });
});
viewModel.get("button22yd") &&
  viewModel.get("button22yd").on("click", function (data) {
    // 测试脚本按钮-提示类--单击
    cb.utils.confirm({
      title: "弹窗标题", // String 或 React.Element
      message: "弹窗内容", // String 或 React.Element
      actions: "", // 按钮组, {text, onPress, style}, 值为数组。不传该参数显示默认的确定取消。传 [] 则不显示操作按钮
      okFunc: () => {
        cb.utils.alert("ok click");
        console.log("确定回调");
      },
      cancelFunc: () => {
        cb.utils.alert("cancel click");
        console.log("取消回调");
      }
    });
  });