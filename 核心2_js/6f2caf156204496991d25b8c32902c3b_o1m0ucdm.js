viewModel.get("button18bj") &&
  viewModel.get("button18bj").on("click", function (data) {
    // 三方附件--单击
    var codeValue = viewModel.get("code").getValue();
    cb.rest.invokeFunction("ycReqManagement.backOpenApiFunction.queryFileId", { code: codeValue }, function (err, res) {
      var idvalue = res.id;
      //查询数据id弹出页面
      let data2 = {
        billtype: "Voucher", // 单据类型
        billno: "e00f895d", // 单据号
        domainKey: "yourKeyHere",
        params: {
          mode: "edit", // (编辑态edit、新增态add、浏览态browse)
          readOnly: true,
          id: idvalue
        }
      };
      cb.loader.runCommandLine("bill", data2, viewModel);
    });
  });
let supplyFiled = ["suggestSpplierDocId_name", "defines!define1_name", "defines!define2_name", "defines!define3_name", "defines!define4_name"];
supplyFiled.forEach((item) => {
  let field = viewModel.get("prayBillDetails")?.getEditRowModel()?.get(item);
  if (field) {
    field.on("beforeBrowse", (data) => {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      let org = viewModel.get("reqOrgId")?.getValue();
      condition.simpleVOs = [
        { field: "vendorApplyRange.org", op: "eq", value1: org },
        {
          field: "if (vendorApplyRange.isCreator = 1 || vendorApplyRange.vendordetails.id = null) then vendorextends.stopstatus else vendorApplyRange.vendordetails.stopstatus end",
          op: "eq",
          value1: 0
        }
      ];
      field.setFilter(condition);
    });
  }
});