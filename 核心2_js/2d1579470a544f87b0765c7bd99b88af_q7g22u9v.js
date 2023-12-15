function init(event) {
  var viewModel = this;
  viewModel.on("afterLoadData", function (event) {
    let selectRowName = viewModel.get("params").selectRows;
    let oldParentName = viewModel.get("parent_name");
    oldParentName.setValue(selectRowName, false);
    viewModel.get("parent_name").on("beforeValueChange", function (event) {
      if (typeof selectRowName !== "undefined" || selectRowName !== null) {
        try {
          let value = event.obj.value;
        } catch (e) {
        } finally {
          if (typeof value === "undefined" || value === null) {
            cb.utils.alert("上级分类不能为空");
            return false;
          }
        }
      }
    });
    viewModel.on("beforeSave", function (event) {
      if (typeof selectRowName !== "undefined" || selectRowName !== null) {
        if (typeof value === "undefined" || value === null) {
          cb.utils.alert("上级分类不能为空");
          return false;
        }
      }
    });
    // 弹窗下部按钮触发弹窗关闭
    viewModel.get("btnSave").on("click", function (event) {
      // 弹窗关闭
      viewModel.communication({
        type: "modal",
        payload: {
          data: false
        }
      });
      //刷新父页面
    });
  });
}