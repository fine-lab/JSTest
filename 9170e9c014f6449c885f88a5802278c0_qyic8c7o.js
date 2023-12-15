viewModel.on("customInit", function (data) {
  // 询价定标单--页面初始化
  viewModel.on("beforeSave", function (args) {
    let transactionTypeId = viewModel.get("transactionTypeId").getValue();
    if (!transactionTypeId || transactionTypeId == "") {
      cb.utils.alert("定标交易类型不能为空！", error);
    }
    let savedata = JSON.parse(args.data.data);
    var buofferid = viewModel.get("buyofferid").getValue();
    let userRes = cb.rest.invokeFunction("ycSouringInquiry.func.currentUser", {}, function (err, res) {}, viewModel, { async: false });
    let deptid = userRes.result.dept_id;
    let deptName = userRes.result.dept_id_name;
    let res = cb.rest.invokeFunction("ycSouringInquiry.func.queryBuyOffer", { id: buofferid }, function (err, res) {}, viewModel, { async: false });
    debugger;
    console.log(res);
    let byOfferObj = res.result.data;
    let cgsf = byOfferObj.define1;
    let cgxffs = byOfferObj.define3;
    savedata["define!define2_name"] = deptName;
    savedata["define!define2"] = deptid;
    let cgfs = viewModel.get("define!define27").getValue();
    if (!cgfs) {
      savedata["define!define27"] = byOfferObj.headfreedefines.define27;
      savedata["define!define28"] = byOfferObj.headfreedefines.define28;
    }
    args.data.data = JSON.stringify(savedata);
  });
});