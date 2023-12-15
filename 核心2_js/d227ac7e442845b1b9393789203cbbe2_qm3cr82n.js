var org_list = [];
viewModel.on("customInit", function (data) {
  //获取表格对象
  var learning_learner1List = viewModel.getGridModel();
  //学员参照过滤
  learning_learner1List
    .getEditRowModel()
    .get("staffNew_name")
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
        },
        {
          field: "org_id",
          op: "in",
          value1: org_list
        }
      );
      this.setFilter(condition);
    });
});
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    var all_data = viewModel.getData();
    var orgId = all_data.org_id;
    // 组织--值改变后
    cb.rest.invokeFunction("1e7a5eba85b3402f8932206ec918705a", { orgId: orgId }, function (err, res) {
      if (res) {
        console.log("===子级组织信息列表===");
        console.log(res);
        org_list = res.res1;
        //接口调通后加上组织条件
      } else {
        console.log(err);
        cb.utils.alert("获取学员范围数据异常！" + err);
      }
    });
  });