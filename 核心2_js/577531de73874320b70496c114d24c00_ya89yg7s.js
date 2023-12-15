viewModel.get("button22jj") &&
  viewModel.get("button22jj").on("click", function (data) {
    //推送SAP--单击
    var param = {};
    var promiseoa = new cb.promise();
    cb.rest.invokeFunction(
      "GL.cust02.cust0301",
      param,
      function (err, res) {
      }
    );
    return promiseoa;
  });
viewModel.get("glUnAudit") &&
  viewModel.get("glUnAudit").on("click", function (data) {
    //取消审核--单击
    var ids = [];
    viewModel
      .getGridModel()
      .getSelectedRows()
      .forEach((head) => {
        ids.push(head.id);
      });
    var param = { ids: ids };
  });
viewModel.get("glAudit") &&
  viewModel.get("glAudit").on("click", function (data) {
    //审核--单击
    var ids = [];
    viewModel
      .getGridModel()
      .getSelectedRows()
      .forEach((head) => {
        ids.push(head.id);
      });
    var param = { ids: ids };
    cb.rest.invokeFunction("GL.cust02.cust0303", param, function (err, res) {
    });
  });
viewModel.get("glAuditOp") &&
  viewModel.get("glAuditOp").on("click", function (data) {
    //审核--单击
    var ids = [];
    viewModel
      .getGridModel()
      .getSelectedRows()
      .forEach((head) => {
        ids.push(head.id);
      });
    var param = { ids: ids };
    cb.rest.invokeFunction("GL.cust02.cust0303", param, function (err, res) {
    });
  });
viewModel.on("beforebatchunaudit", (args) => {
  var returnPromise = new cb.promise(); //同步
  cb.utils.confirm({
    title: "弃审确认", // String 或 React.Element
    message: "确认要弃审吗？", // String 或 React.Element
    actions: "", // 按钮组, {text, onPress, style}, 值为数组。不传该参数显示默认的确定取消。传 [] 则不显示操作按钮
    okFunc: () => {
      console.log("确定回调");
      return returnPromise.resolve();
    },
    cancelFunc: () => {
      console.log("取消回调");
      returnPromise.reject();
    }
  });
  return returnPromise;
});