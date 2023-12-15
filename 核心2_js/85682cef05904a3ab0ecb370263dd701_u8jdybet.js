function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
loadStyle(".showNow {display: block!important}");
viewModel.get("button41hf") &&
  viewModel.get("button41hf").on("click", function (data) {
    // 弹框按钮--单击
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal12xa", //模态框容器编码
        viewModel: viewModel,
        data: {
          onSuccess: () => {
            alert(111);
          }
        }
      }
    });
  });