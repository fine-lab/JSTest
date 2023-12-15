viewModel.get("button44jj") &&
  viewModel.get("button44jj").on("click", function (data) {
    disable(true);
    var arrSelectList = viewModel.getGridModel().getSelectedRows();
    if (arrSelectList.length == 0) {
      cb.utils.alert("未选中数据", "error");
      disable(false);
      return;
    }
    var listCode = [];
    var errListCode = []; //不符合编码
    arrSelectList.forEach((element) => {
      let cust_name = element.cust_name.toLowerCase(); //客户
      if (cust_name.indexOf("metro") != -1) {
        listCode.push(element.code);
      } else {
        errListCode.push(element.code);
      }
    });
    if (errListCode.length > 0) {
      cb.utils.alert("该按钮仅对metro客户有效,请勿选择非metro客户", "error");
      disable(false);
      return;
    }
    //去重
    listCode = noRepeat2(listCode);
    //推送edi发货通知--单击
    let result = cb.rest.invokeFunction(
      "ST.backOpenApiFunction.sendedi",
      {
        code: listCode
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    if (result.result.code == "200") {
      cb.utils.alert("推送成功", "success");
    }
    disable(false);
  });
function disable(v) {
  viewModel.get("button44jj").setDisabled(v);
}
function noRepeat2(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) == -1) {
      //解释：如果新数组里没有就放进去，有就放不进了
      newArr.push(arr[i]);
    }
  }
  return newArr;
}