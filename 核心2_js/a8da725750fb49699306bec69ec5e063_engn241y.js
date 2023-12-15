viewModel.on("customInit", function (data) {
  // 通用合同录入--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  var user = cb.rest.AppContext.user;
  var userid = user.userId;
  var promise = new cb.promise();
  debugger;
  setTimeout(function () {
    //合同录入
    cb.rest.invokeFunction("6d9d8b413e7a4d83acdcd684d346f3f1", { custdoctype: "1" }, function (err, res) {
      debugger;
      var allrole;
      if (err != null) {
        cb.utils.alert("查询数据异常" + err.message);
        return false;
      } else {
        debugger;
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
        if (retorgid !== null && retorgid.length > 0) {
          args.params.condition.simpleVOs[0].conditions.push({
            field: "qiandingdanwei",
            op: "in",
            value1: retorgid
          });
        }
        if (retdeptid !== null && retdeptid.length > 0) {
          args.params.condition.simpleVOs[0].conditions.push({
            field: "jingbanbumen",
            op: "in",
            value1: retdeptid
          });
        }
        if (userid !== null && userid.length > 0) {
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
viewModel.get("button40yb") &&
  viewModel.get("button40yb").on("click", function (data) {
    // 合同完成--单击
    debugger;
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows !== null) {
      cb.rest.invokeFunction("916b6f7b6d964a11bd4929e559fb9d85", { data: rows }, function (err, res) {
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
viewModel.get("button57bi") &&
  viewModel.get("button57bi").on("click", function (data) {
    // 合同进行中--单击
    debugger;
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows !== null) {
      cb.rest.invokeFunction("53c2c4e5719e41438b777422d3b143c5", { data: rows }, function (err, res) {
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