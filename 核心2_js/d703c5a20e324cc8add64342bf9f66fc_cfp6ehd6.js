viewModel.on("customInit", function (data) {
  // 合同录入--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  var user = cb.rest.AppContext.user;
  debugger;
  var promise = new cb.promise();
  debugger;
  setTimeout(function () {
    // 合同录入
    cb.rest.invokeFunction("43cc416616ac4fc0b2d7a0a1631a4f1d", { custdoctype: "1" }, function (err, res) {
      debugger;
      var allrole;
      if (err != null) {
        cb.utils.alert("查询数据异常" + err.message);
        return false;
      } else {
        debugger;
        var userid = res.userid;
        orgid = res.orgid;
        deptCode = res.deptCode;
        usercode = res.usercode;
        debugger;
        args.isExtend = true;
        var retorgid = res.retorgid;
        var retdeptid = res.retdeptid;
        if (args.params.condition.simpleVOs == null) {
          args.params.condition.simpleVOs = [
            {
              logicOp: "or",
              conditions: []
            }
          ];
        }
        var retorgid = res.retorgid;
        var retdeptid = res.retdeptid;
        if (retorgid.length > 0) {
          args.params.condition.simpleVOs[0].conditions.push({
            field: "qiandingdanwei",
            op: "in",
            value1: retorgid
          });
        }
        if (retdeptid.length > 0) {
          args.params.condition.simpleVOs[0].conditions.push({
            field: "jingbanbumen",
            op: "in",
            value1: retdeptid
          });
        }
        if (userid.length > 0) {
          args.params.condition.simpleVOs[0].conditions.push({
            field: "jingbanren",
            op: "in",
            value1: userid
          });
        }
      }
      promise.resolve();
    });
  }, 10);
  return promise;
});
viewModel.get("button27nb") &&
  viewModel.get("button27nb").on("click", function (data) {
    //执行中--单击
    debugger;
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows !== null) {
      cb.rest.invokeFunction("809b849bb8c14d98a4f58250dc44c0fd", { data: rows }, function (err, res) {
        if (err != null) {
          debugger;
          cb.utils.alert("查询数据异常" + err.message);
          return false;
        } else {
          debugger;
          viewModel.execute("refresh");
        }
      });
    } else {
      cb.utils.alert("请先选中至少一行数据！");
    }
    viewModel.execute("refresh");
  });
viewModel.get("button47si") &&
  viewModel.get("button47si").on("click", function (data) {
    //已完结--单击
    debugger;
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows !== null) {
      cb.rest.invokeFunction("564c5c55fac543f3b1c9150b7fcc5502", { data: rows }, function (err, res) {
        if (err != null) {
          debugger;
          cb.utils.alert("查询数据异常" + err.message);
          return false;
        } else {
          debugger;
          viewModel.execute("refresh");
        }
      });
    } else {
      cb.utils.alert("请先选中至少一行数据！");
    }
    viewModel.execute("refresh");
  });