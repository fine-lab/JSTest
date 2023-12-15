viewModel.get("button18sd") &&
  viewModel.get("button18sd").on("click", function (data) {
    // 确认--单击
    //检测项目
    var projectValue = viewModel.get("project").getValue();
    //供应商
    var vendorValue = viewModel.get("vendor").getValue();
    if (projectValue == null) {
      cb.utils.alert("检测项目不可为空！");
      return false;
    }
    if (vendorValue == null) {
      cb.utils.alert("供应商不可为空！");
      return false;
    }
    //依据检测项目查询委外且未生成检测订单的收样单数据
    var wwsydRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.queryWwSyd", { projectId: projectValue }, function (err, res) {}, viewModel, { async: false });
    if (wwsydRes.error) {
      cb.utils.alert("查询收样单数据异常：" + wwsydRes.error.message);
      return false;
    }
    var allRows = wwsydRes.result.allDatas;
    if (allRows.length == 0) {
      cb.utils.alert("未找到符合生成检测订单的数据！");
      return false;
    }
    //依据检测项目、供应商查询委外项目取价表
    var queryGysRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.queryGysTable", { projectId: projectValue, vendorId: vendorValue }, function (err, res) {}, viewModel, { async: false });
    if (queryGysRes.error) {
      cb.utils.alert("查询供应商取价表数据异常：" + queryGysRes.error.message);
      return false;
    }
    var gysTableRes = queryGysRes.result.gysTableRes;
    if (gysTableRes.length == 0) {
      cb.utils.alert("未找到符合条件的供应商取价表数据！");
      return false;
    }
    //业务日期
    var businessDate = cb.rest.AppContext.globalization.businessDate;
    var nowTime = "";
    if (businessDate == null) {
      nowTime = getTime();
    } else {
      nowTime = new Date(businessDate).format("yyyy-MM") + "-01";
    }
    //循环生成委外检测订单
    for (var i = 0; i < allRows.length; i++) {
      let rowData = allRows[i];
      rowData.vendorId = vendorValue; //供应商id
      rowData.qjbmoney = gysTableRes[0].money; //含税单价
      rowData.qjbwushuijine = gysTableRes[0].wushuijine; //无税单价
      rowData.qjbtaxRate = gysTableRes[0].taxRate; //税率
      var sendWwRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.sendWwJcdd", { bodyData: rowData, nowTime: nowTime }, function (err, res) {}, viewModel, { async: false });
      if (sendWwRes.error) {
        cb.utils.confirm("样本编号【" + rowData.yangbenbianhao + "】下推委外检测订单异常：" + sendWwRes.error.message);
        return false;
      }
    }
    cb.utils.alert("批量生成检测订单成功！");
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
//拆分数组
function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}
function getTime() {
  var date = new Date();
  var year = date.getFullYear(); //  返回的是年份
  var month = date.getMonth() + 1; //  返回的月份上个月的月份，记得+1才是当月
  var dates = date.getDate();
  if (month < 10) month = "0" + month;
  return year + "-" + month + "-01";
}