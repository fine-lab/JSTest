viewModel.on("afterMount", function (args) {
  // 控制 用车评价 组件的显隐性，只在审批后呈现
  var { mode, billType, billNo, billData } = viewModel.getParams();
  if (billData.verifystate === 2) {
    viewModel.execute("updateViewMeta", { code: "ecsuite12se", visible: true });
  } else {
    viewModel.execute("updateViewMeta", { code: "ecsuite12se", visible: false });
  }
  console.log(viewModel);
  setTimeout(function () {
    document.querySelector(".cooperation-btn.cooperation-btn-primary").onclick = function () {
      let msg = document.querySelector(".cooperation-comment-header-editor").value;
      if (msg) {
        cb.rest.invokeFunction(
          "GT2015AT1.apicode.findRole",
          {
            msg
          },
          function (err, res) {}
        );
      }
    };
  }, 500);
});