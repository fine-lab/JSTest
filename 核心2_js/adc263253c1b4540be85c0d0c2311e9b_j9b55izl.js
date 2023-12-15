viewModel.get("button22wf") &&
  viewModel.get("button22wf").on("click", function (data) {
    // 调用前端公共函数--单击
    cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT181E5A5C08480005/common?domainKey=developplatform"], function (a) {
      let res = a.getUserDeptOrg({}, viewModel);
    });
  });