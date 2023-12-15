viewModel.on("customInit", function (data) {
  var viewModel = this;
  viewModel.get("button9fc") &&
    viewModel.get("button9fc").on("click", function (data) {
      // 确定--单击
      //暂时只能选择一条单据
      var id = data.id4ActionAuth[0];
      console.log(id);
      cb.rest.invokeFunction(
        "GT37846AT3.backOpenApiFunction.getFHD_id",
        { id: id },
        function (err, res) {
          console.log(res.data[0]);
          var DepartmentID = res.data[0].DepartmentID; //销售部门id
          var YeWuYuan_ID = res.data[0].YeWuYuan_ID; //销售业务员id
          var agentId_ID = res.data[0].agentId_ID; //客户id
          var dDate = res.data[0].dDate; //单据日期
          var receiveContacter = res.data[0].receiveContacter; //客户联系人
          var receiveContacterPhone = res.data[0].receiveContacterPhone; //客户联系人移动电话
          var id = res.data[0].id; //客户联系人移动电话
          let org_id = res.data[0].org_id; //销售组织id
          console.log(org_id);
          cb.rest.invokeFunction(
            "GT37846AT3.backOpenApiFunction.addSale",
            {
              DepartmentID: DepartmentID,
              YeWuYuan_ID: YeWuYuan_ID,
              agentId_ID: agentId_ID,
              id: id,
              dDate: dDate,
              receiveContacter: receiveContacter,
              receiveContacterPhone: receiveContacterPhone,
              org_id: org_id
            },
            function (err, res) {
              console.log(res.id);
              let data = {
                billtype: "Voucher", //单据类型
                billno: "voucher_order", //单据号
                domainKey: "yourKeyHere", //领域编码
                params: {
                  mode: "edit", //(卡片页面区分编辑态edit、新增add)
                  id: res.id //TODO：填写详细id
                }
              };
              //打开一个单据，并在当前页面显示
              cb.loader.runCommandLine("bill", data, viewModel);
            }
          );
          debugger;
        }
      );
    });
  // 销售退货--页面初始化
});