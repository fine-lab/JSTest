viewModel.on("afterWorkflowBeforeQueryAsync", (args) => {
  debugger;
  let adt = viewModel.getParams().query.adt;
  if (adt && adt == "wf" && args.actionCode == "audit") {
    window.jDiwork.closeWin();
  }
});
viewModel.on("customInit", function (data) {
  // 通用合同录入详情--页面初始化
  debugger;
  var user = cb.rest.AppContext.user;
  var userid = user.userId;
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
      var jbr = viewModel.get("jingbanren").getValue();
      if (jbr === null || jbr === undefined) {
        //单位
        viewModel.get("qiandingdanwei").setValue(org_id);
        viewModel.get("qiandingdanwei_name").setValue(org_id_name);
        //部门
        viewModel.get("jingbanbumen").setValue(dept_id);
        viewModel.get("jingbanbumen_name").setValue(dept_id_name);
        //经办人
        viewModel.get("jingbanren").setValue(psndocid);
        viewModel.get("jingbanren_name").setValue(psndocname);
      }
    }
  });
});
//保存前校验名称是否重复
viewModel.on("beforeSave", function (args) {
  const resJSON = JSON.parse(args.data.data);
  const lx = resJSON._status;
  if (lx === "Insert") {
    const htnameV = viewModel.get("hetongmingcheng").getValue();
    let returnPromise = new cb.promise();
    cb.rest.invokeFunction("378928641cc249a38a918a524cb81e3b", { htnameV: htnameV }, function (err, res) {
      if (res.chek === 0) {
        cb.utils.alert(res.mess);
        returnPromise.reject(); //失败
      } else {
        returnPromise.resolve(); //成功
      }
      if (err !== null) {
        code = err.code;
        returnPromise.reject();
      }
    });
    return returnPromise;
  }
});
//提交前校验创建者和当前用户是否一致
viewModel.on("beforeSubmit", function (args) {
  const user = cb.rest.AppContext.user.userId;
  const htid = viewModel.get("id").getValue();
  let returnPromise = new cb.promise();
  cb.rest.invokeFunction("7592934ba6c84c03ab767b9d8903853d", { htid: htid }, function (err, res) {
    if (res.creator != null) {
      if (res.creator != user) {
        cb.utils.alert({ title: "非创建人不允许提交", type: "error", duration: "3", mask: true });
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    } else {
      returnPromise.resolve();
    }
    if (err !== null) {
      code = err.code;
      returnPromise.reject();
    }
  });
  return returnPromise;
});
viewModel.on("afterSave", function (event) {
  //保存后刷新
  viewModel.execute("refresh");
});
viewModel.get("hetongleibie_name") &&
  viewModel.get("hetongleibie_name").on("afterValueChange", function (data) {
    //合同类别--值改变后
    viewModel.get("hetongleixing_name").setValue("");
  });