viewModel.on("modeChange", function (data) {
  setTimeout(function () {
    viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
  }, 500);
});
viewModel.on("customInit", function (data) {
  // 会议计划表详情--页面初始化
  viewModel.on("afterLoadData", function () {
    //数据加载完成后
    var userRes = cb.rest.invokeFunction("AT15F164F008080007.sampleRece.getUserData", {}, function (err, res) {}, viewModel, { async: false });
    if (userRes.error) {
      cb.utils.alert(userRes.error.message);
      return false;
    }
    var userData = userRes.result.returnData; //当前登陆信息
    let mode = viewModel.getParams().mode;
    if (mode.toLowerCase() === "add") {
      //新增
      viewModel.get("shenqingren").setValue(userData.id);
      viewModel.get("shenqingren_name").setValue(userData.name);
    }
  });
});
//子表删行后事件
viewModel.on("afterDeleteRow", function (params) {
  //回写主表含税金额
  var allBody = viewModel.getGridModel().getRows();
  let total = 0;
  for (var i = 0; i < allBody.length; i++) {
    let ss = allBody[i].zhifujine === undefined ? 0 : Number(allBody[i].zhifujine);
    total += ss;
  }
  var verifystateValue = viewModel.get("verifystate").getValue();
  if ("1" == verifystateValue) {
    //审批中
    var shijicanfeiValue = viewModel.get("shijicanfei").getValue() === undefined ? 0 : viewModel.get("shijicanfei").getValue();
    var shijiqitafeiyongValue = viewModel.get("shijiqitafeiyong").getValue() === undefined ? 0 : viewModel.get("shijiqitafeiyong").getValue();
    var shijifeiyonghejiValue = total + shijicanfeiValue + shijiqitafeiyongValue;
    viewModel.get("ziduan15").setValue(total); //实际讲课费
    viewModel.get("shijifeiyongheji").setValue(shijifeiyonghejiValue); //实际费用合计
  } else {
    //非审批中
    var canfeiValue = viewModel.get("canfei").getValue() === undefined ? 0 : viewModel.get("canfei").getValue();
    var qitafeiyongValue = viewModel.get("qitafeiyong").getValue() === undefined ? 0 : viewModel.get("qitafeiyong").getValue();
    var jihuafeiyonghejiValue = total + canfeiValue + qitafeiyongValue;
    viewModel.get("jiangkefei").setValue(total); //讲课费
    viewModel.get("jihuafeiyongheji").setValue(jihuafeiyonghejiValue); //计划费用合计
  }
});
viewModel.get("peoAllList") &&
  viewModel.get("peoAllList").on("afterCellValueChange", function (data) {
    // 表格-人员子表--单元格值改变后
    var gridModel = viewModel.getGridModel();
    var verifystateValue = viewModel.get("verifystate").getValue();
    //编辑表格单元格后事件
    //拿到行号
    let rowIndex = data.rowIndex;
    //获取填入的值
    var getValue = data.value;
    //获取之前的值
    var getoldValue = data.oldValue;
    var getcellName = data.cellName;
    let total = 0;
    if (getValue != getoldValue) {
      switch (getcellName) {
        case "zhifujine": { //支付金额
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "zhifujine");
          slAl = slAl === undefined ? 0 : slAl;
          //回写主表
          var allBody = gridModel.getRows();
          for (var i = 0; i < allBody.length; i++) {
            let ss = allBody[i].zhifujine === undefined ? 0 : Number(allBody[i].zhifujine);
            total += ss;
          }
          if ("1" == verifystateValue) {
            //审批中
            var shijicanfeiValue = viewModel.get("shijicanfei").getValue() === undefined ? 0 : viewModel.get("shijicanfei").getValue();
            var shijiqitafeiyongValue = viewModel.get("shijiqitafeiyong").getValue() === undefined ? 0 : viewModel.get("shijiqitafeiyong").getValue();
            var shijifeiyonghejiValue = total + shijicanfeiValue + shijiqitafeiyongValue;
            viewModel.get("ziduan15").setValue(total); //实际讲课费
            viewModel.get("shijifeiyongheji").setValue(shijifeiyonghejiValue); //实际费用合计
          } else {
            //非审批中
            var canfeiValue = viewModel.get("canfei").getValue() === undefined ? 0 : viewModel.get("canfei").getValue();
            var qitafeiyongValue = viewModel.get("qitafeiyong").getValue() === undefined ? 0 : viewModel.get("qitafeiyong").getValue();
            var jihuafeiyonghejiValue = total + canfeiValue + qitafeiyongValue;
            viewModel.get("jiangkefei").setValue(total); //讲课费
            viewModel.get("jihuafeiyongheji").setValue(jihuafeiyonghejiValue); //计划费用合计
          }
          break;
        }
      }
    }
  });