viewModel.on("customInit", function (data) {
  // 相对方管理详情--页面初始化
  debugger;
  var user = cb.rest.AppContext.user;
  var userid = user.userId;
  if (data.jingbanren_name == undefined) {
    cb.rest.invokeFunction("97daf79c6ff54777a33cdf967df42491", { userid: userid }, function (err, res) {
      if (err !== null) {
        code = err.code;
        if (code === 999) {
          cb.utils.alert(err.message);
        }
      } else {
        debugger;
        var psndocid = res.psndocid;
        var psndocname = res.psndocname;
        var dept_id_name = res.dept_id_name;
        var dept_id = res.dept_id;
        var org_id_name = res.org_id_name;
        var org_id = res.org_id;
        debugger;
        //单位
        viewModel.get("chuangjianrenzuzhi").setValue(org_id);
        viewModel.get("chuangjianrenzuzhi_name").setValue(org_id_name);
        //部门
        viewModel.get("chuangjianrenbumen").setValue(dept_id);
        viewModel.get("chuangjianrenbumen_name").setValue(dept_id_name);
        //经办人
        viewModel.get("chuangjianren").setValue(psndocid);
        viewModel.get("chuangjianren_name").setValue(psndocname);
      }
    });
  }
});