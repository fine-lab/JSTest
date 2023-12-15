viewModel.on("customInit", function (data) {
  let invokeFunction1 = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    proxy.doProxy(data, callback);
  };
  // 员工培训计划--页面初始化
  viewModel.get("emp_name_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  viewModel.get("emp_name_name").on("afterValueChange", function (data) {
    //员工职位学历赋值
    let staffId = data.value.id;
    invokeFunction1(
      "GT22176AT10.publicFunction.getStaffDetail",
      { staffId: staffId },
      function (err, res) {
        if (err) {
          cb.utils.alert(err.massage, "error");
        } else {
          let staffInfo = JSON.parse(res.staffInfo).data;
          let staffEdu = staffInfo.staffEdu;
          let staffJob = staffInfo.staffJob;
          if (staffEdu != undefined && staffEdu.length > 0) {
            viewModel.get("education").setValue(staffInfo.staffEdu[0].degreeName);
          }
          if (staffJob != undefined && staffJob.length > 0) {
            viewModel.get("positional_title").setValue(staffInfo.staffJob[0].jobName);
          }
        }
      },
      { domainKey: "sy01" }
    );
  });
});