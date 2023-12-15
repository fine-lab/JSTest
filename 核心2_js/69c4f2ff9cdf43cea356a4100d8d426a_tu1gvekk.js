viewModel.get("btnAdd") &&
  viewModel.get("btnAdd").on("click", function (data) {
    // 新增--单击,提交保存
    let c_id = viewModel.get("item52kf").getValue();
    let c_name = viewModel.get("item83gg").getValue();
    let c_num = viewModel.get("item115vf").getValue();
    if (!c_id || !c_name || !c_num) {
      alert("输入值不能为空！");
    } else {
      confirm("已获取组件值，点击“ok”,即将调用API接口，提交数据");
      cb.rest.invokeFunction("93fe8644780544a38c6b86759faa724d", { id: c_id, name: c_name, num: c_num }, function (err, res) {
        alert(res.info + " 即将刷新当前页面，更新页面数据显示！");
        location.reload();
      });
    }
  });