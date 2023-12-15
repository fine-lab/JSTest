viewModel.get("button19rd") &&
  viewModel.get("button19rd").on("click", function (data) {
    //按钮--单击
    const value = viewModel.get("servbill_no").getValue();
    cb.utils.alert(value);
  });
viewModel.on("customInit", function (data) {
  //服务单详情--页面初始化
  viewModel.on("afterSave", function (args) {
    var name = args.res.servbill_no;
    var person = args.res.creator;
    var time = args.res.createTime;
    cb.rest.invokeFunction("AT18882E1616F80005.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {
      cb.utils.alert(err + ":" + res.data);
    });
    return true;
  });
});