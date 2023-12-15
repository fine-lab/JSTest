var ts = null;
viewModel.on("customInit", function (data) {
  // 学员端-课程学习2详情--页面初始化
  console.log(viewModel);
  var params = viewModel.getParams();
  var domainKey = params.domainKey;
  var course_id = viewModel.getParams().perData;
  var learning_plan_id = viewModel.getParams().learning_plan_id;
  var task_id = viewModel.getParams().task_id;
  console.log("===========[learning_plan_id]=========");
  console.log(learning_plan_id);
  var reqParams = {
    id: learning_plan_id,
    taskId: task_id
  };
  viewModel.on("afterLoadData", function () {
    console.log("===========[afterLoadData]=========");
    cb.rest.invokeFunction("9969de3b3fea4868a2e1a58767bce975", { course_id: course_id }, function (err, res) {
      if (res) {
        //表格数据加载==================================
        console.log("[===获取进度开始===]");
        var reqParams2 = {
          planId: learning_plan_id,
          taskIds: [task_id]
        };
        var rate_data = getRate(viewModel, reqParams2);
        console.log(rate_data);
        console.log("[===获取进度结束===]");
        var res_data = res.res[0];
        set_data(viewModel, "title", res_data.title);
        set_data(viewModel, "type", res_data.type);
        set_data(viewModel, "cover", res_data.cover);
        set_data(viewModel, "period", res_data.period);
        set_data(viewModel, "description", res_data.description);
        set_data(viewModel, "courseware", res_data.courseware);
        set_data(viewModel, "courseware2", res_data.courseware2);
        var data1 = viewModel.getData();
        viewModel.setData(data1);
        if (res_data.type == 1) {
          viewModel.get("courseware2").setVisible(true);
          viewModel.get("courseware").setVisible(false);
        } else {
          viewModel.get("courseware2").setVisible(false);
          viewModel.get("courseware").setVisible(true);
        }
      } else {
        console.log(err);
      }
    });
    function saveLearningLog1() {
      var options = {
        domainKey: domainKey
      };
      console.log("*************************");
      console.log("[method]" + JSON.stringify(options));
      var proxy = cb.rest.DynamicProxy.create({
        settle: {
          url: "/learning/log/save",
          method: "post",
          tenant_id: "youridHere",
          options: options
        }
      });
      proxy.settle(reqParams, function (err, res) {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log("=====[saveLearningLog:start]=========");
          console.log(res);
          console.log("=====[saveLearningLog:end]=========");
        }
      });
    }
    ts = setInterval(saveLearningLog1, 9000);
  });
});
//点击返回
viewModel.get("btnAbandonBrowst") &&
  viewModel.get("btnAbandonBrowst").on("click", function (data) {
    //清除定时器
    if (ts) {
      clearInterval(ts);
      ts = null;
    }
  });
function set_data(viewModel, name, val) {
  viewModel.get(name).setValue(val);
}
function getRate(viewModel, reqParams) {
  var params = viewModel.getParams();
  var options = {
    domainKey: params.domainKey
  };
  console.log("*************************");
  console.log("[method]" + JSON.stringify(options));
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "/learning/plan/task/rates",
      method: "post",
      tenant_id: "youridHere",
      options: options
    }
  });
  proxy.settle(reqParams, function (err, res) {
    if (err) {
      console.log(err);
      cb.utils.alert(err.message);
      return;
    } else {
      console.log("*************************");
      console.log(res);
      console.log("*************************");
      if (res) {
        var task_rate = Math.floor(res[0].task_rate * 100) / 100;
        var task_rate = task_rate + "%";
      } else {
        var task_rate = "0%";
      }
      set_data(viewModel, "item33zg", task_rate);
    }
  });
}
viewModel.get("button1xa") &&
  viewModel.get("button1xa").on("click", function (data) {
    // 按钮--单击
    if (ts) {
      clearInterval(ts);
      ts = null;
    }
    var learning_plan_id = viewModel.getParams().learning_plan_id;
    var task_id = viewModel.getParams().task_id;
    var end_reqParams = {
      id: learning_plan_id,
      taskId: task_id
    };
    var options = {
      domainKey: viewModel.getParams().domainKey
    };
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/learning/log/end",
        method: "post",
        tenant_id: "youridHere",
        options: options
      }
    });
    proxy.settle(end_reqParams, function (err, res) {
      if (err) {
        console.log(err);
        cb.utils.alert(err.message);
        return;
      } else {
        console.log("===end接口====");
        console.log(res);
      }
    });
    //获取缓存数据
    var plan_cache = cb.cache.get("plan_cache_" + learning_plan_id);
    // 清除缓存
    cb.cache.clear("plan_cache_" + learning_plan_id);
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucher",
        billno: "cf8240d2",
        params: {
          id: learning_plan_id
        }
      },
      viewModel
    );
  });