viewModel.on("customInit", function (data) {
  // 保存前时间参数校验
  viewModel.on("beforeSave", function (saveParams) {
    var saveDatas = JSON.parse(saveParams.data.data);
    const isAfterDate = (dateA, dateB) => dateA > dateB;
    if (!isAfterDate(saveDatas.end_time, saveDatas.start_time)) {
      cb.utils.alert("结束时间要大于开始时间");
      return false;
    }
  });
  //获取表格对象
  var learning_learner1List = viewModel.get("learning_learner1List");
  var learning_task1List = viewModel.get("learning_task1List");
  // 增行校验
  viewModel.on("beforeAddRow", function (params) {
    let addRowFlag = true;
    var key = params.params.key;
    if ("btnAddRowlearning_task1" == key) {
      let rowData = learning_task1List.getRows();
      rowData.map((row, index) => {
        if (row.course_name == undefined || row.course_name == null) {
          cb.utils.alert("请填充第" + (index + 1) + "行数据！");
          addRowFlag = false;
          return addRowFlag;
        }
      });
    } else if ("btnAddRowlearning_learner1" == key) {
      let rowData = learning_learner1List.getRows();
      rowData.map((row, index) => {
        if (row.emp_name == undefined || row.emp_name == null) {
          cb.utils.alert("请填充第" + (index + 1) + "行数据！");
          addRowFlag = false;
          return addRowFlag;
        }
      });
    }
    return addRowFlag;
  });
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
      var learner_ids = [];
      const learnerList = learning_learner1List.getAllData();
      const learnerList_len = learnerList.length;
      if (learnerList_len > 1) {
        for (var i = 0; i < learnerList_len - 1; i++) {
          learner_ids.push(learnerList[i].emp);
        }
      }
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push(
        {
          field: "id",
          op: "nin",
          value1: learner_ids
        }
      );
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
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
  });