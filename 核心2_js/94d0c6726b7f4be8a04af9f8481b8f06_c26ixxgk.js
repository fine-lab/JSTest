viewModel.get("btnAbandon") &&
  viewModel.get("btnAbandon").on("click", function (data) {
    // 取消--单击
    //关闭模态框
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 生成--单击
    var orgValue = viewModel.get("org_id").getValue(); //组织
    var prefixValue = viewModel.get("item21ld").getValue(); //前缀
    var lengthValue = viewModel.get("item32aj").getValue(); //长度
    var startValue = viewModel.get("item44sc").getValue(); //起始
    var endValue = viewModel.get("item57rg").getValue(); //结束
    var nowDate = new Date();
    var yearValue = nowDate.getFullYear();
    if (orgValue == null || prefixValue == null || lengthValue == null || startValue == null || endValue == null) {
      cb.utils.alert("字段不可为空！", "error");
      return false;
    }
    var newstart = Number(startValue);
    var newend = Number(endValue);
    if (isNaN(newstart) || isNaN(newend)) {
      cb.utils.alert("起始、结束请输入正确的数字，请修改！", "error");
      return false;
    }
    if (!Number.isInteger(newstart) || !Number.isInteger(newend)) {
      cb.utils.alert("起始、结束请输入正确的整数，请修改！", "error");
      return false;
    }
    if (newstart > newend) {
      cb.utils.alert("起始字段需小于结束字段，请修改！", "error");
      return false;
    }
    if (startValue.length > lengthValue || endValue.length > lengthValue) {
      cb.utils.alert("起始、结束位数应不大于长度字段值，请修改！", "error");
      return false;
    }
    var insertArray = new Array();
    let isadd = true;
    let insertValue = newstart;
    while (isadd) {
      if (insertValue <= newend) {
        let pushData = insertValue + "";
        if (pushData.length < lengthValue) {
          pushData = setPushData(pushData, lengthValue);
          insertArray.push(prefixValue + pushData);
        } else {
          insertArray.push(prefixValue + insertValue);
        }
        insertValue += 1;
      } else {
        isadd = false;
      }
    }
    var addRes = cb.rest.invokeFunction("AT1590F01809B00007.backDesignerFunction.addTaxNo", { orgId: orgValue, addArray: insertArray, year: yearValue }, function (err, res) {}, viewModel, {
      async: false
    });
    if (addRes.error) {
      cb.utils.alert(addRes.error.message, "error");
      return false;
    } else {
      cb.utils.alert("新增成功，共新增" + addRes.result.res.length + "条数据！");
      var parentViewModel = viewModel.getCache("parentViewModel");
      //属性父model页面
      parentViewModel.execute("refresh");
      //关闭模态框
      viewModel.communication({ type: "modal", payload: { data: false } });
    }
  });
//不满足数据需补0
function setPushData(pushData, lengthValue) {
  let isAdd = true;
  while (isAdd) {
    pushData = "0" + pushData;
    if (pushData.length == lengthValue) {
      isAdd = false;
    } else {
      isAdd = true;
    }
  }
  return pushData;
}