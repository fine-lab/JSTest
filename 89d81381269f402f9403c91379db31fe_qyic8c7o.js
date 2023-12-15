viewModel.get("button15yc") &&
  viewModel.get("button15yc").on("click", function (data) {
    // 原客户经理确认--单击
    // 开始移交--单击
    const selectRows = viewModel.getGridModel().getSelectedRows();
    const user = viewModel.getAppContext().user;
    let postData = [];
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return fmt;
    };
    if (selectRows.length > 0) {
      selectRows.forEach((item, index) => {
        // 不管接收人是否确认，都更新时间时间字段。
        // 原客户经理是否确认为“是”的时候才更新状态为3
        if (item.transferStatus == "2") {
          if (item.receivePerson_name && item.handedIsTrue == 1) {
            var object = {
              id: item.id,
              handedIsTrue: item.handedIsTrue,
              transferStatus: "3",
              handedIsTrueTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
            };
            postData.push(object);
          }
        }
      });
      cb.rest.invokeFunction(
        "AT16A11A2C17080008.rule.updateBillData",
        {
          postData: postData,
          type: "M"
        },
        function (err, res) {
          if (!err) {
            viewModel.execute("refresh");
          }
          viewModel.communication({
            type: "modal",
            payload: {
              data: false
            }
          });
        }
      );
    } else {
      cb.utils.alert("请先选择数据！");
    }
  });
viewModel.on("beforeSearch", function (args) {
  let res = cb.rest.invokeFunction(
    "AT16A11A2C17080008.rule.getStaffInfo",
    {
      id: viewModel.getAppContext().user.userId
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  const resObj = JSON.parse(res.result.apiResponse);
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "isShow",
    value1: "1"
  });
  commonVOs.push({
    itemName: "handedPerson",
    value1: resObj.code == "200" && resObj.data[0].id
  });
});
viewModel.on("modeChange", function (e) {
  if (e == "edit") {
    viewModel.get("button15yc").setVisible(false);
  } else {
    viewModel.get("button15yc").setVisible(true);
  }
});
viewModel.get("btnBatchSave") &&
  viewModel.get("btnBatchSave").on("click", function (data) {
    setTimeout(function () {
      cb.utils.alert("当前保存仅是对确认状态的保存，不会自动提交确认。若需提交确认请点击原客户经理确认按钮。");
    }, 1000);
  });
viewModel.get("button15yc") &&
  viewModel.get("button15yc").on("click", function (data) {
    // 原客户经理确认--单击
    cb.utils.alert("先点击【编辑】将“原客户经理是否确认”字段“是”或“否”维护上后点击【批量保存】，再点击【原客户经理确认】，原客户经理确认按钮不会自动填录“原客户经理是否确认”字段。");
  });
viewModel.get("custinfo_1632544961119387653") &&
  viewModel.get("custinfo_1632544961119387653").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    //以下为原客户经理操作时需要校验接收人是否为空
    viewModel
      .getGridModel()
      .getAllData()
      .forEach((item, index) => {
        if (item.transferStatus == "2") {
          const flag = !item.receivePerson;
          viewModel.getGridModel().setCellState(index, "handedIsTrue", "readOnly", !item.receivePerson);
          viewModel.getGridModel().setCellState(index, "handedIsTrueTime", "readOnly", !item.receivePerson);
          viewModel.getGridModel().setCellState(index, "handedAttachment", "readOnly", !item.receivePerson);
          viewModel.getGridModel().setCellState(index, "handedRemark", "readOnly", !item.receivePerson);
        } else {
          // 如果不等于2，那么改行无编辑权限
          viewModel.getGridModel().setRowState(index, "readOnly", true);
        }
      });
  });