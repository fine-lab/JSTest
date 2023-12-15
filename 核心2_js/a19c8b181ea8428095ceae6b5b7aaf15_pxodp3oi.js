function Loading() {
  var hook = React.useState(true);
  stop = hook[1];
  return React.createElement(TinperNext.Spin, { spinning: hook[0] });
}
viewModel.get("button19re") &&
  viewModel.get("button19re").on("click", function (data) {
    // 同步账簿--单击
    ReactDOM.render(React.createElement(Loading), document.createElement("div"));
    let rest = cb.rest.invokeFunction(
      "AT1703B12408A00002.selfApi.synAccbookApi",
      {},
      function (err, res) {
        stop();
        if (res.rst) {
          cb.utils.alert("温馨提示,账套同步成功!当前有[" + res.noSetCount + "]条账簿需要配置" + res.codes, "info");
          viewModel.execute("refresh");
        }
      },
      viewModel,
      { async: true }
    );
  });