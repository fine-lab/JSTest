viewModel.get("button46bb") &&
  viewModel.get("button46bb").on("click", function (data) {
    // 委托产品清单--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    //获取选中行的行号
    var allData = gridModel.getData();
    for (var i = 0; i < allData.length; i++) {
      // 委托方企业编码
      var clientCode = allData[i].clientCode;
      let body = {
        // 单据类型
        billtype: "VoucherList",
        //单据号
        billno: "99fbf264",
        // 领域号
        domainKey: "yourKeyHere",
        params: {
          mode: "browse", // (编辑态edit、新增态add、浏览态browse)
          //传参
          clientCode: clientCode
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", body, viewModel);
    }
  });
viewModel.get("button37ie") &&
  viewModel.get("button37ie").on("click", function (data) {
    // 确认--单击
    debugger;
    var code = viewModel.get("clientCode").getValue();
    var enable = viewModel.get("enable").getValue();
    if (enable == "1") {
      alert("委托方企业编码为： " + code + " 单据的状态已经是启用状态无需再次启用！");
    } else {
      var expiryDate = viewModel.get("expiryDate").getValue();
      var timestamp = Date.parse(new Date());
      var registration_Date = Date.parse(expiryDate);
      var selectedId = viewModel.get("id").getValue();
      // 创建人
      var creator_userName = viewModel.get("creator_userName").getValue();
      //修改人
      var modifier_userName = viewModel.get("modifier_userName").getValue();
      var cancelAPI = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.currentuser", { id: selectedId }, function (err, res) {}, viewModel, { async: false });
      // 确认人
      var cancelNames = cancelAPI.result.currentUser.name;
      if (timestamp > registration_Date) {
        alert("委托方企业编码为： " + code + " 单据的许可证/备案凭证已过期不可启用！");
      } else {
        params = {
          id: selectedId,
          cancelNames: cancelNames
        };
        var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.confrimUpClient", { params }, function (err, res) {}, viewModel, { async: false });
        if (res.error != undefined) {
          alert("委托方企业编码为： " + code + " 单据错误信息：" + res.error.message);
        } else {
          viewModel.get("enable").setValue("1");
          alert("委托方企业编码为： " + code + " 的单据启用成功！");
        }
      }
    }
    // 自动刷新页面
    viewModel.execute("refresh");
  });
viewModel.get("button42cg") &&
  viewModel.get("button42cg").on("click", function (data) {
    // 取消确认--单击
    debugger;
    var code = viewModel.get("clientCode").getValue();
    var enable = viewModel.get("enable").getValue();
    if (enable == "0") {
      alert("委托方企业编码为： " + code + " 单据的状态已经是停用状态无需再次停用！");
    } else {
      var selectedId = viewModel.get("id").getValue();
      params = { id: selectedId };
      // 调用api函数更新实体
      var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.cancelUpClient", { params }, function (err, res) {}, viewModel, { async: false });
      if (res.error != undefined) {
        alert("委托方企业编码为： " + code + " 单据错误信息：" + res.error.message);
      } else {
        viewModel.get("enable").setValue("0");
        alert("委托方企业编码为： " + code + " 的单据停用成功！");
      }
    }
    // 自动刷新页面
    viewModel.execute("refresh");
  });
viewModel.get("entrustmentContractList") &&
  viewModel.get("entrustmentContractList").getEditRowModel() &&
  viewModel.get("entrustmentContractList").getEditRowModel().get("startDate") &&
  viewModel
    .get("entrustmentContractList")
    .getEditRowModel()
    .get("startDate")
    .on("valueChange", function (data) {
      // 开始委托时间--值改变
      debugger;
      var gridModel = viewModel.getGridModel();
      //获取选中行的行号
    });
// 选择部分委托场景需必填
function partOfProductTypeBIsNullCheck() {
  debugger;
  var refDictCode = viewModel.get("EntrustBusiScopeRef_dict_code").getValue();
  var partOfProductType = viewModel.get("part_of_product_type").getValue();
  if (refDictCode == "100102") {
    viewModel.get("part_of_product_type").setState("bIsNull", false);
  } else {
    viewModel.get("part_of_product_type").setState("bIsNull", true);
  }
}
// 页面初始化
viewModel.on("afterLoadData", function (args) {
  debugger;
  partOfProductTypeBIsNullCheck();
});
// 委托业务范围改变事件
viewModel.get("EntrustBusiScopeRef_dict_name").on("afterValueChange", function (data) {
  partOfProductTypeBIsNullCheck();
});
// 详情页点击编辑事件
viewModel.on("afterEdit", function (args) {
  partOfProductTypeBIsNullCheck();
});
// 复制后
viewModel.on("afterCopy", function (args) {
  debugger;
  var rangeCodeSql = "select id, dict_code from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code where id = " + viewModel.get("EntrustBusiScopeRef").getValue();
  var rangeData = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: rangeCodeSql }, function (err, res) {}, viewModel, { async: false });
  if (!rangeData.result) {
    rangeData = { result: { res: [{ dict_code: "-1" }] } };
  }
  var refDictCode = viewModel.get("EntrustBusiScopeRef_dict_code").getValue();
  if (rangeData.result.res[0].dict_code == "100102") {
    viewModel.get("part_of_product_type").setState("bIsNull", false);
  } else {
    viewModel.get("part_of_product_type").setState("bIsNull", true);
  }
});
// 保存前事件
viewModel.on("beforeSave", function (args) {
  var fileName = document.querySelector(".upload-item-title").title;
  var data = JSON.parse(args.data.data);
  // 上载附件名存入库
  data.protocol_attachment_file_name = fileName;
  // 附件地址
  if (protocolAttachmentFileKey) {
    data.protocol_attachment_file_url = protocolAttachmentFileKey;
  }
  args.data.data = JSON.stringify(data);
});
var protocolAttachmentFileKey = null;
viewModel.get("protocol_attachment").on("afterFileUploadSuccess", function (fileRes) {
  debugger;
  protocolAttachmentFileKey = fileRes.file.fileKey;
});