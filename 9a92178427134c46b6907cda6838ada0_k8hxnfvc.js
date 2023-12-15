viewModel.on("customInit", function (data) {
  // 询价定标单--页面初始化
  viewModel.on("afterLoadData", function () {
    var currentState = viewModel.getParams().mode;
    cb.utils.alert("我执行了！");
    cb.rest.invokeFunction("ycSouringInquiry.backDesignerFunction.queryBuyOfferSql", {}, function (err, res) {
      debugger;
    });
    //新增或编辑时，根据产品线字段，给认证等级setDataSource
    if (currentState == "add" || currentState == "edit") {
    }
  });
  viewModel.on("beforeSave", function (args) {
    cb.utils.alert("不能保存！");
    var buofferid = viewModel.get("buyofferid").getValue();
    let userRes = cb.rest.invokeFunction("ycSouringInquiry.backDesignerFunction.currentUser", {}, function (err, res) {}, viewModel, { async: false });
    let deptid = userRes.result.dept_id;
    let deptName = userRes.result.dept_id_name;
    let res = cb.rest.invokeFunction("ycSouringInquiry.backDesignerFunction.queryBuyOffer", { id: buofferid }, function (err, res) {}, viewModel, { async: false });
    debugger;
    console.log(res);
    let byOfferObj = res.result.data;
    let cgsf = byOfferObj.define1;
    let cgxffs = byOfferObj.define3;
    let savedata = JSON.parse(args.data.data);
    savedata["define!define2_name"] = deptName;
    savedata["define!define2"] = deptid;
    savedata["1212"] = "";
    savedata["1212"] = "";
    args.data.data = JSON.stringify(savedata);
  });
});
viewModel.on("customInit", function (data) {
  //询价定标单--页面初始化
});