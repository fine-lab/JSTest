viewModel.on("customInit", function (data) {
  //大额支付预警设置详情--页面初始化
  viewModel.on("beforeSave", function (args) {
    console.log(args);
    let StaffIds = viewModel.get("PaymentAlert_staffNewList").getValue();
    if (StaffIds.length > 0) {
      let staffarr = [];
      for (let i = 0; i < StaffIds.length; i++) {
        staffarr.push(StaffIds[i].staffNew);
      }
      let result = cb.rest.invokeFunction("AT1833A66C08480009.utils.userIDbyStaffID", { staffarr: staffarr }, function (err, res) {}, viewModel, { async: false });
      let userarr = result.result.userarr;
      if (userarr !== undefined) {
        let data = JSON.parse(args.data.data);
        data.Userids = JSON.stringify(userarr);
        args.data.data = JSON.stringify(data);
      } else {
        cb.utils.alert("查询用户ID时报错，\n请联系开发人员！", "error");
        return false;
      }
    } else {
      cb.utils.alert("请设置推送的员工", "error");
      return false;
    }
  });
});