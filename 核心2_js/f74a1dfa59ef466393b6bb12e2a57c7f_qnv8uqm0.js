viewModel.on("customInit", function (data) {
  // 整合营销补充协议合同详情--页面初始化
});
viewModel.on("afterLoadData", function (data) {
  debugger;
  var user = cb.rest.AppContext.user;
  var userid = user.userId;
  if (data.verifystate == 0) {
    cb.rest.invokeFunction("d800777b036a4e39adf18453a8fdc0e1", { userid: userid }, function (err, res) {
      if (err !== null) {
        code = err.code;
        if (code === 999) {
          cb.utils.alert(err.message);
        }
      } else {
        var psndocid = res.psndocid;
        var psndocname = res.psndocname;
        var dept_id_name = res.dept_id_name;
        var dept_id = res.dept_id;
        var org_id_name = res.org_id_name;
        var org_id = res.org_id;
        viewModel.get("zhidanrenbumenxin").setValue(dept_id);
        viewModel.get("zhidanrenbumenxin_name").setValue(dept_id_name);
        viewModel.get("zhidanrenzuixin").setValue(psndocid);
        viewModel.get("zhidanrenzuixin_name").setValue(psndocname);
      }
    });
  }
});