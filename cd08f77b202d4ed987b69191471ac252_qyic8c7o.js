viewModel.get("button13rj") &&
  viewModel.get("button13rj").on("click", function (data) {
    // 接收人确认按钮--单击
    // 开始移交--单击
    let selectRows = viewModel.getGridModel().getSelectedRows();
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
        // 如果原客户经理不为空，并且原客户经理确认为 是 的时候 或者 没有原客户经理的时候
        // 接收人是否确认不为空才更新交接状态
        // 如果原客户经理确认为是   接收人确认为是 那么不过判断状态直接可以提交
        debugger;
        if ((item.transferStatus == "3" && item.receiveIsTrue == 1) || (item.receiveIsTrue == 1 && item.handedIsTrue == 1)) {
          if ((item.handedPerson_name && item.handedIsTrue == "1") || !item.handedPerson_name || (item.receiveIsTrue == 1 && item.handedIsTrue == 1)) {
            var object = {
              id: item.id,
              transferStatus: "4",
              receiveTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
            };
            postData.push(object);
          }
        }
      });
      cb.rest.invokeFunction(
        "AT16A11A2C17080008.rule.updateBillData",
        {
          postData: postData,
          type: "J"
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
  args.isExtend = true;
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
    itemName: "receivePerson",
    value1: resObj.code == "200" && resObj.data[0].id
  });
});
viewModel.on("modeChange", function (e) {
  if (e == "edit") {
    viewModel.get("button13rj").setVisible(false);
    viewModel.get("btnBatchPrintnow").setVisible(false);
  } else {
    viewModel.get("button13rj").setVisible(true);
    viewModel.get("btnBatchPrintnow").setVisible(true);
  }
});
viewModel.get("button13rj") &&
  viewModel.get("button13rj").on("click", function (data) {
    // 接收人确认--单击
    cb.utils.alert("先点击【编辑】将“接收人是否确认”字段“是”或“否”维护上后点击【批量保存】，再点击【接收人确认】，接收人确认按钮不会自动填录“接收人是否确认”字段。");
  });
viewModel.get("custinfo_1632545141502246915") &&
  viewModel.get("custinfo_1632545141502246915").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    // 设置cell状态
    viewModel
      .getGridModel()
      .getAllData()
      .forEach((item, index) => {
        if (item.transferStatus == "3") {
          //如下为判断原客户经理是否确认，依照判断结果是否允许接收人操作；
          // 如果原客户经理为空，允许接收人编辑。
          if (!item.handedPerson_name) {
            setCellState(index, false);
          } else {
            // 若原客户经理不为空，那么判断原客户经理是否确认为是的时候，允许接收人确认。
            if (item.handedIsTrue != "1") {
              setCellState(index, true);
            } else {
              setCellState(index, false);
            }
          }
        } else {
          viewModel.getGridModel().setRowState(index, "readOnly", true);
        }
      });
    function setCellState(index, flag) {
      viewModel.getGridModel().setCellState(index, "receiveIsTrue", "readOnly", flag);
      viewModel.getGridModel().setCellState(index, "receiveAttachment", "readOnly", flag);
      viewModel.getGridModel().setCellState(index, "receiveTime", "readOnly", flag);
      viewModel.getGridModel().setCellState(index, "receiveRemark", "readOnly", flag);
    }
  });
viewModel.get("btnBatchPrintnow") &&
  viewModel.get("btnBatchPrintnow").on("click", function (data) {
    // 发起交接--单击
    const selectRows = viewModel.getGridModel().getSelectedRows();
    let postData = [];
    if (selectRows.length > 0) {
      selectRows.forEach((item, index) => {
        // （1）交接状态为空
        // （2）交接状态不为空，不更新“交接状态”字段；
        if (item.transferStatus == null) {
          let transferStatus = item.handedPerson_name ? "2" : "3";
          let object = {
            id: item.id,
            transferStatus: transferStatus
          };
          postData.push(object);
        }
      });
      cb.rest.invokeFunction(
        "AT16A11A2C17080008.rule.updateBillData",
        {
          postData: postData,
          type: "J"
        },
        function (err, res) {
          if (!err) {
            viewModel.execute("refresh");
          }
        }
      );
    } else {
      cb.utils.alert("请先选择数据！");
    }
  });