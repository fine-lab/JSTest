viewModel.get("button24th") &&
  viewModel.get("button24th").on("click", function (data) {
    // 测试--单击
    debugger;
    // 获取领域
    var options = {
      domainKey: "yourKeyHere",
      async: false
    };
    // 查询授权页面的信息
    var proxyUser = cb.rest.DynamicProxy.create({
      settle: {
        url: "https://www.example.com/",
        method: "POST",
        options: options
      }
    });
    var param = {
      bClick: true,
      bEmptyWithoutFilterTree: false,
      billnum: "sys_authority",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "全部身份类型查询"
          },
          {
            itemName: "isDefault",
            value1: true
          },
          {
            itemName: "name",
            value1: "关光华"
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 1102914164
      },
      locale: "zh_CN",
      ownDomain: "u8c-auth",
      page: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: -1
      },
      refimestamp: "1660290749491",
      serviceCode: "u8c_GZTACT020"
    };
    var res = proxyUser.settle(param, function (err, result) {});
    cb.utils.alert(res);
  });