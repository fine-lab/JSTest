viewModel.get("button26sd") &&
  viewModel.get("button26sd").on("click", function (data) {
    // 批量保存2--单击
    var viewModel = this;
    var name = document.getElementById("ucfbasedoc.MD_YWLYmD_YWLY").value;
    var data = {
      name: name
    };
    cb.rest.invokeFunction(
      "AT162B7B5E16700009.frontCustomFunction.updateProjectLog",
      {
        data
      },
      function (err, res) {
        console.log(res);
      }
    );
  });