viewModel.on("customInit", function (data) {
  // 供销云权限查询--页面初始化
  viewModel.on("beforeSearch", function (data) {
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    let filterModelInfo = filterViewModelInfo.get("authOrgId");
    let realModelInfo = filterModelInfo.getFromModel();
    var orgs = realModelInfo.getValue();
    console.log(orgs);
    let result = cb.rest.invokeFunction("GT53685AT3.org.searchParentOrgs", { ids: orgs }, function (err, res) {}, viewModel, { async: false });
    console.log(result);
    var { pars } = result.result;
    var commonVOs = data.params.condition.commonVOs;
    for (let i in commonVOs) {
      let commonVO = commonVOs[i];
      if (commonVO.itemName == "authOrgId") {
        delete commonVOs[i];
        break;
      }
    }
    data.isExtend = true;
    data.params.condition.simpleVOs = [
      {
        logicOp: "or",
        conditions: [
          {
            logicOp: "and",
            conditions: [
              {
                field: "authOrgId",
                op: "in",
                value1: orgs
              },
              {
                field: "IncludeSubordinates",
                op: "eq",
                value1: "0"
              }
            ]
          },
          {
            logicOp: "and",
            conditions: [
              {
                field: "authOrgId",
                op: "in",
                value1: pars
              },
              {
                field: "IncludeSubordinates",
                op: "eq",
                value1: "1"
              }
            ]
          }
        ]
      }
    ];
  });
});
viewModel.get("button24ce") &&
  viewModel.get("button24ce").on("click", function (data) {
    // 搜索--单击
  });
viewModel.get("button49og") &&
  viewModel.get("button49og").on("click", function (data) {
    //按钮--单击
  });