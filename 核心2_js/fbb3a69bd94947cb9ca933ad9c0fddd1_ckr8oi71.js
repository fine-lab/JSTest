viewModel.get("picihao_picihao") &&
  viewModel.get("picihao_picihao").on("afterValueChange", function (data) {
    // 批次号--值改变后
    debugger;
    const datas = viewModel.getAllData();
    //批次号
    var picihao = datas.picihao_picihao;
    //日期
    var date = datas.riqiqujian;
    //猪只类型
    var pigtype = datas.zhuzhileixing;
    var dat = new Date(date);
    var year = dat.getFullYear();
    var month = dat.getMonth() + 1 < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1;
    var newdates = year + "-" + month;
    var qg = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.CostSharing", { picihao: picihao, newdates: newdates, pigtype: pigtype }, function (err, res) {}, viewModel, {
      async: false
    });
    if (qg.error) {
      cb.utils.alert("错误原因:" + qg.error.message);
      return;
    }
    var ts = qg.result.PigCount;
    var biz = qg.result.biz;
    viewModel.get("cunlantoushuyuehuizong").setValue(ts);
    viewModel.get("fentanbizhong").setValue(biz);
    viewModel.get("dongyinzhi").setValue(biz * ts);
    var resl = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.Costsharings", { newdates: newdates }, function (err, res) {}, viewModel, { async: false });
    if (resl.error) {
      cb.utils.alert("错误原因:" + resl.error.message);
      return;
    }
    //动因值
    var dyRes = biz * ts;
    //期间费用
    var moneys = resl.result.money;
    //查询费用分摊日期期间所有动因值
    var totalValue = resl.result.totalValue;
    viewModel.get("feiyongfentan").setValue((dyRes / (totalValue + dyRes)) * moneys);
  });