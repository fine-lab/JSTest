viewModel.get("learning_task1List") &&
  viewModel.get("learning_task1List").getEditRowModel() &&
  viewModel.get("learning_task1List").getEditRowModel().get("course.id") &&
  viewModel
    .get("learning_task1List")
    .getEditRowModel()
    .get("course.id")
    .on("blur", function (data) {
      // 课程--失去焦点的回调
    });
viewModel.get("button11vg").on("click", function (args) {
  var data1 = viewModel.getData();
  console.log("===11111====data1======");
  console.log(data1);
  console.log("===11111====data1======");
  var learning_plan_id = data1.id;
  // 缓存数据
  cb.cache.set("plan_cache_" + learning_plan_id, data1);
  var gridModel = viewModel.getGridModel();
  //获取点击行的行数据（根据行号）
  const rowData = gridModel.getRow(args.index);
  //获取表格当前页面所有的行数据
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "voucher",
      billno: "82f429ef",
      params: {
        perData: rowData.course_id,
        learning_plan_id: learning_plan_id,
        task_id: rowData.id,
        mode: "edit",
        readOnly: true
      }
    },
    viewModel
  );
});
viewModel.on("customInit", function (data) {
  // 设置定时器 清除去学习的定时器
  function getRate() {
    //获取缓存，检查数据是否可以替换
    var isReplace = cb.cache.get("learning_plan_isReplace");
    if (isReplace) {
      var my_plan_cache = cb.cache.get("plan_cache_" + learning_plan_id);
      if (my_plan_cache) {
        console.log("===获取缓存数据===");
        console.log(my_plan_cache);
        console.log("====缓存替换start====");
        var data_top = viewModel.getData();
        data_top.total_rate = my_plan_cache.total_rate;
        viewModel.setData(data_top);
        console.log("======替换表格========");
        var list = my_plan_cache.learning_task1List;
        for (var i = 0, len = list.length; i < len; i++) {
          list[i].course_id = list[i].course;
          list[i].course_code = list[i].course_no;
          if (list[i].task_rate == 100) {
            var task_rate = "已完成";
          } else {
            var task_rate = "待完成";
          }
          list[i].item53jc = task_rate;
        }
        var gridModel = viewModel.getGridModel();
        gridModel.setState("dataSourceMode", "local");
        gridModel.setDataSource(list);
        console.log("======数据替换end========");
        cb.cache.clear("learning_plan_isReplace");
      }
    }
  }
  setInterval(getRate, 2000);
  // 学员端-学习计划_2详情--页面初始化
  var params = viewModel.getParams();
  var domainKey = params.domainKey;
  var options = {
    domainKey: domainKey
  };
  var data1 = viewModel.getData();
  var learning_plan_id = params.id;
  var reqParams = {
    id: learning_plan_id
  };
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "/learning/plan/view?id=" + learning_plan_id,
      method: "get",
      tenant_id: "youridHere",
      options: options
    }
  });
  proxy.settle(reqParams, function (err, res) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("====数据替换start====");
      console.log(res);
      viewModel.get("id").setValue(res.id);
      viewModel.get("name").setValue(res.name);
      viewModel.get("start_time").setValue(res.start_time);
      viewModel.get("end_time").setValue(res.end_time);
      viewModel.get("cover").setValue(res.cover);
      viewModel.get("info").setValue(res.info);
      viewModel.get("code").setValue(res.code);
      var data2 = viewModel.getData();
      var total_rate = Math.floor(res.rate * 100) / 100;
      data2.total_rate = total_rate + "%";
      viewModel.setData(data2);
      console.log("======数据替换end========");
    }
  });
  //表格数据加载==================================
  console.log("[===表格加载===]");
  var gridModel = viewModel.getGridModel();
  //分页设置测试
  gridModel.setPageSize(999);
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  var userId = viewModel.getAppContext().user.userId;
  //获取当前页码
  var pageIndex = gridModel.getPageIndex();
  //获取当前页条数
  var pageSize = gridModel.getPageSize();
  var reqParams = {
    planId: learning_plan_id,
    page: pageIndex,
    pageSize: pageSize
  };
  pageInfo(viewModel, reqParams);
  gridModel.on("pageInfoChange", function () {
    //获取当前页码
    var pageIndex = gridModel.getPageIndex();
    //获取当前页条数
    var pageSize = gridModel.getPageSize();
    var reqParams = {
      planId: learning_plan_id,
      page: pageIndex,
      pageSize: pageSize
    };
    pageInfo(viewModel, reqParams);
  });
});
function pageInfo(viewModel, reqParams) {
  var params = viewModel.getParams();
  var options = {
    domainKey: params.domainKey
  };
  console.log("*************************");
  console.log("[method]" + JSON.stringify(options));
  console.log(reqParams);
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "/learning/plan/tasks",
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
      var gridModel = viewModel.getGridModel();
      //获取当前页码
      var pageIndex = gridModel.getPageIndex();
      //获取当前页条数
      var pageSize = gridModel.getPageSize();
      console.log("*********bianli*************");
      var list = res.list;
      for (var i = 0, len = list.length; i < len; i++) {
        list[i].course_id = list[i].course;
        list[i].course_code = list[i].course_no;
        if (list[i].task_rate == 100) {
          var task_rate = "已完成";
        } else {
          var task_rate = "待完成";
        }
        list[i].item53jc = task_rate;
      }
      console.log(pageIndex);
      console.log(pageSize);
      console.log("*********bianli************");
      gridModel.setState("dataSourceMode", "local");
      gridModel.setDataSource(list);
      gridModel.setPageInfo({
        pageSize: pageSize,
        pageIndex: pageIndex,
        recordCount: 999
      });
    }
  });
}