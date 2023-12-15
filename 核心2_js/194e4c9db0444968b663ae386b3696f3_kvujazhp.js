// 查询前事件
viewModel.on("beforeSearch", function (data) {
  // 门户端默认只能看到当前客户信息
  if (viewModel.getParams().query.type === "portal") {
    let customerId = cb.rest.AppContext.user.docId ? ccb.rest.AppContext.user.docId : "";
    data.params.condition.commonVOs.push({
      itemName: "customer_id",
      value1: customerId
    });
  }
  let queryVo = data.params.condition.commonVOs;
  queryVo.forEach((item) => {
    if (item.itemName === "check_date") {
      item.value1 = item.value1.substring(0, 7);
      item.value2 = item.value2.substring(0, 7);
    }
  });
});
// 更新历史数据
viewModel.get("button18ik").on("click", function () {
  let allData = [];
  viewModel
    .getGridModel()
    .getAllData()
    .forEach((item) => {
      console.log(item.check_date);
      allData.push({
        id: item.id,
        check_date: item.check_date.substring(0, 7),
        _status: "Update"
      });
    });
  let newData = {
    billNo: "0939a757List",
    allData: allData
  };
  console.log(newData);
  cb.rest.invokeFunction("GT6923AT3.checkOrderBe.updHisData", newData, function (err, res) {
    console.log(res);
    viewModel.execute("refresh");
  });
});