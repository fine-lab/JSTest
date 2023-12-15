viewModel.get("button19ce") &&
  viewModel.get("button19ce").on("click", function (data) {
    //测试分页--单击
    let yhtUserId = "yourIdHere";
    let serviceCode = "1728814436602871815";
    let tenantId = "yourIdHere";
    let result = cb.rest.invokeFunction("GT9912AT31.auth.queryMainOrgs", { yhtUserId, serviceCode, tenantId }, function (err, res) {}, viewModel, { async: false });
    console.log(result);
    let orgs = result.result.res.data;
    let table = "GT34544AT7.GT34544AT7.GxsOrg";
    let condition = {
      key: "yourkeyHere",
      symbol: "in",
      value1: orgs
    };
    let params = ["id", "sysOrg", "sysOrgCode"];
    let res = cb.rest.invokeFunction("GT9912AT31.common.querySqlPage", { table, params, condition, count: true, pageNum: 1, pageSize: 5 }, function (err, res) {}, viewModel, { async: false });
    console.log(res);
  });
viewModel.get("button60rj") &&
  viewModel.get("button60rj").on("click", function (data) {
    //测试主组织数据--单击
    let yhtUserId = "yourIdHere";
    let serviceCode = "1728814436602871815";
    let tenantId = "yourIdHere";
    let result = cb.rest.invokeFunction("GT9912AT31.common.queryUserSqlPage", { yhtUserId, serviceCode, tenantId }, function (err, res) {}, viewModel, { async: false });
    console.log(result);
  });
viewModel.get("button82db") &&
  viewModel.get("button82db").on("click", function (data) {
    //日志测试--单击
    for (let i = 0; i < 100; i++) {
      let msg = "testMsg=>消息=> " + i;
      let queen = "testqueen2";
      setTimeout(() => {
        let result = cb.rest.invokeFunction("GT9912AT31.common.logQueen", { msg, queen }, function (err, res) {}, viewModel, { async: false });
        console.log(result);
      }, 100);
    }
  });
viewModel.get("button106gd") &&
  viewModel.get("button106gd").on("click", function (data) {
    let table = "org.func.BaseOrg";
    let params = {
      code: "SZX000"
    };
    let domainKey = "yourKeyHere";
    //按钮--单击
    let res = cb.rest.invokeFunction("GT9912AT31.common.checkParamRepeat", { id: undefined, table, params, domainKey }, function (err, res) {}, viewModel, { async: false });
    let repeat = res.result.repeat;
    console.log(repeat);
  });