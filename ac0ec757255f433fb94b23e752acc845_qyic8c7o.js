viewModel.on("beforeSave", function (data) {
  // 联系人--页面初始化
  var options = {
    domainKey: "yourKeyHere",
    async: false
  };
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "https://www.example.com/",
      method: "POST",
      options: options
    }
  });
  const customer = viewModel.get("customer").getValue();
  debugger;
  const reqParams = {
    page: {
      pageSize: 20,
      pageIndex: 1,
      totalCount: 1
    },
    billnum: "cust_contactlist",
    condition: {
      commonVOs: [
        {
          itemName: "schemeName",
          value1: "全部"
        },
        {
          itemName: "isDefault",
          value1: true
        },
        {
          value1: [customer],
          itemName: "customer"
        }
      ],
      filtersId: "yourIdHere",
      solutionId: 89037979,
      simpleVOs: []
    },
    bClick: true,
    bEmptyWithoutFilterTree: false,
    fromYonyou: "true",
    serviceCode: "contact",
    refimestamp: "1670148945241",
    ownDomain: "yycrm",
    tplid: 4060784,
    queryId: 1670150503132
  };
  let resData = proxy.settle(reqParams, function (err, result) {});
  if (resData) {
    let isDefault = resData.result.recordList.map((item) => item.isDefault).includes(true);
    if (!isDefault && !yya.get("isDefault").getValue()) {
      cb.utils.alert("客户需要一个默认的联系人，请指定！");
      return false;
    }
  }
  debugger;
});
viewModel.on("customInit", function (data) {
  // 联系人--页面初始化
});