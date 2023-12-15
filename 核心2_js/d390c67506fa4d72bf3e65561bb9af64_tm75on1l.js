viewModel.on("customInit", function (data) {
  //获取表格对象
  var learning_learner1List = viewModel.get("learning_learner1List");
  var learning_task1List = viewModel.get("learning_task1List");
  // 新增态设置表格字段 learning_plan1_rate 隐藏
  if ("add" == viewModel.getParams().mode) {
    learning_learner1List.setColumnState("learning_plan1_rate", "bHidden", "true");
  }
  // 课程参照过滤
  learning_task1List
    .getEditRowModel()
    .get("course_title")
    .on("beforeBrowse", function () {
      const value = [];
      const courseList = learning_task1List.getAllData();
      const courseList_len = courseList.length;
      if (courseList_len > 1) {
        console.log("courseList", courseList);
        for (var i = 0; i < courseList_len - 1; i++) {
          value.push(courseList[i].course);
        }
      }
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "id",
        op: "nin",
        value1: value
      });
      this.setFilter(condition);
    });
  //学员参照过滤
  learning_learner1List
    .getEditRowModel()
    .get("emp_name")
    .on("beforeBrowse", function () {
      const value = [];
      const learnerList = learning_learner1List.getAllData();
      const learnerList_len = learnerList.length;
      if (learnerList_len > 1) {
        for (var i = 0; i < learnerList_len - 1; i++) {
          value.push(learnerList[i].emp);
        }
      }
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "id",
        op: "nin",
        value1: value
      });
      this.setFilter(condition);
    });
  //保存数据--刷新学习任务进度
  viewModel.on("afterSave", function (save_params) {
    console.log("===保存并调用刷新任务进度接口===");
    console.log(save_params);
    var params = viewModel.getParams();
    var learning_plan_id = params.id;
    if (learning_plan_id) {
      var domainKey = params.domainKey;
      var options = {
        domainKey: domainKey
      };
      var reqParams = {
        id: learning_plan_id
      };
      var proxy = cb.rest.DynamicProxy.create({
        settle: {
          url: "/learning/plan/student/rate/refresh",
          method: "post",
          tenant_id: "youridHere",
          options: options
        }
      });
      setTimeout(function () {
        proxy.settle(reqParams, function (err, res) {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log("======刷新学习任务里所有学员的学习进度========");
            console.log(res);
          }
        });
      }, 1000);
    }
  });
});