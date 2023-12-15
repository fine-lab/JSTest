viewModel.get("button22rh") &&
  viewModel.get("button22rh").on("click", function (data) {
    //按钮--单击
    console.log("00000000000");
    //开启进度条
    ReactDOM.render(React.createElement(Loading), document.createElement("div"));
    //结束进度条
  });