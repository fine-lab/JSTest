viewModel.on("customInit", function (data) {
  // 通用合同变更--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  var user = cb.rest.AppContext.user;
  var userid = user.userId;
  var promise = new cb.promise();
  debugger;
  setTimeout(function () {
    //合同变更
    cb.rest.invokeFunction("6d9d8b413e7a4d83acdcd684d346f3f1", { custdoctype: "1" }, function (err, res) {
      debugger;
      var allrole;
      if (err != null) {
        cb.utils.alert("查询数据异常" + err.message);
        return false;
      } else {
        debugger;
        alldata = res.allData;
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