viewModel.on("customInit", function (data) {
  // 微课_1--页面初始化
  viewModel.on("beforeBatchdelete", function (params) {
    var returnPromise = new cb.promise();
    var selected = JSON.parse(params.data.data);
    console.log(selected);
    var course_ids = [];
    for (var i = selected.length - 1; i >= 0; i--) {
      course_ids.push(selected[i].id);
    }
    console.log(course_ids);
    var params = viewModel.getParams();
    var domainKey = params.domainKey;
    var options = {
      domainKey: domainKey
    };
    var reqParams = {
      ids: course_ids
    };
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/course/deleteValidate",
        method: "post",
        tenant_id: "youridHere",
        options: options
      }
    });
    proxy.settle(reqParams, function (err, res, msg, val, code) {
      if (err) {
        cb.utils.alert("微课已被学习任务引用！");
        returnPromise.reject();
      } else {
        if (code == 200) {
          returnPromise.resolve();
        } else {
          cb.utils.alert("微课已被学习任务引用!");
          returnPromise.reject();
        }
      }
    });
    return returnPromise;
  });
});