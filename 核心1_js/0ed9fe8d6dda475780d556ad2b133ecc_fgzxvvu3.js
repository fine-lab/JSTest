viewModel.on("customInit", function (data) {
  var viewModel = this;
  var gridModel = viewModel.getGridModel(); //获取ListModel
  viewModel.setCache("isSum", true);
  viewModel.on("beforeBatchpush", function (data) {
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    if (data.params.cSvcUrl.indexOf("targetBillNo=fa75fcd8") > 0) {
      let id = [];
      for (let i = 0; i < selectData.length; i++) {
        id.push(selectData[i].id); //主表ID
        if (selectData[i].verifystate != 2) {
          cb.utils.alert("编码为" + selectData[i].code + "的单据未审核", "error");
          return false;
        }
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.curPlanPushCheckList",
        {
          id: id
        },
        function (err, res) {
          debugger;
          if (typeof res != "undefined") {
            if (res.error_info.length > 0) {
              cb.utils.alert(res.error_info);
              promise.reject();
            }
            promise.resolve();
          } else if (err !== null) {
            cb.utils.alert(err);
            promise.reject();
          }
        }
      );
      return promise;
    }
  });
  var dateFormat = function (date, format) {
    date = new Date(date);
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "H+": date.getHours() + 8, //hour+8小时
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      S: date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  };
  gridModel.on("afterSetDataSource", function (data) {
    const rows = gridModel.getRows();
    console.log(rows);
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      console.log(data);
      const actionState = {};
      actions.forEach((action) => {
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data.verifystate == 2 || data.verifystate == "2") {
            actionState[action.cItemName] = { visible: false };
          } else {
            actionState[action.cItemName] = { visible: true };
          }
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});