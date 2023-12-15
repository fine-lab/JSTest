viewModel.get("button10yg") &&
  viewModel.get("button10yg").on("click", function (data) {
    // 取消--单击
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });
let __data = null;
viewModel.on("customInit", function (data) {
  __data = data.__data.params.reqData;
  if (__data.mode == "1") {
    viewModel.get("item4nb").setVisible(false);
  } else if (__data.mode == "2") {
    viewModel.get("approval").setVisible(false);
    setTimeout(function () {
      document.getElementsByTagName("img")[0].remove();
    }, 500);
  } else {
    viewModel.get("item4nb").setVisible(false);
    viewModel.get("approval").setVisible(false);
  }
});
viewModel.get("button4ub") &&
  viewModel.get("button4ub").on("click", function (data) {
    const uri = __data.type == "batch" ? "AT16AD797616380008.API.updateBatch" : "AT16AD797616380008.API.updateData";
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
    if (__data.type == "batch") {
      __data.data.forEach((item) => {
        if (__data.mode == "1") {
          item.approval = viewModel.get("approval").getValue();
        } else {
          item.rejectReason = viewModel.get("item4nb").getValue();
        }
        item.approvalTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
      });
    } else {
      if (__data.mode == "1") {
        __data.data.approval = viewModel.get("approval").getValue();
      } else {
        __data.data.rejectReason = viewModel.get("item4nb").getValue();
      }
      __data.data.approvalTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
    }
    // 确认--单击
    cb.rest.invokeFunction(uri, __data.data, function (err, res) {
      debugger;
      if (!err) {
        var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
        viewModel.communication({
          type: "modal",
          payload: {
            data: false
          }
        });
        let type = __data.data.mode == "1" ? "1" : "2";
        parentViewModel.execute("refresh"); //刷新父页面
        let info = __data.data.mode == "1" || __data.mode == "1" ? "审批成功" : "驳回成功";
        cb.utils.alert(info);
      }
    });
  });
viewModel.get("button4ub") &&
  viewModel.get("button4ub").on("click", function (data) {
    // 确认--单击
  });
viewModel.get("button10yg") &&
  viewModel.get("button10yg").on("click", function (data) {
    // 取消--单击
  });