viewModel.get("item22yf_name") &&
  viewModel.get("item22yf_name").on("beforeBrowse", function (data) {
    debugger;
    // 员工--参照弹窗打开前
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: viewModel.get("handedOrg").getValue()
    });
    this.setFilter(condition);
  });
viewModel.get("button25yj") &&
  viewModel.get("button25yj").on("click", function (data) {
    // 取消--单击
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });
let __data = null;
// 日期方法
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
viewModel.on("customInit", function (data) {
  const reqData = data.__data.params.reqData;
  const conformNum = reqData.selectRowsLength - reqData.selectRows.length;
  // 移交分配弹窗详情--页面初始化
  viewModel.get("item34rk").setValue(`您选择了${reqData.selectRowsLength}行,（其中有${conformNum}已确认，无需再次移交）！`);
  __data = reqData;
});
viewModel.get("button52lh") &&
  viewModel.get("button52lh").on("click", function (data) {
    // 确认--单击
    const postData = [];
    __data.selectRows.forEach((item, index) => {
      var object = {
        id: item.id,
        handedOrg: viewModel.get("handedOrg").getValue(),
        receivePerson: viewModel.get("item22yf").getValue(),
        handedOpetator: __data.handedOpetator,
        handedTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
      };
      if (__data.type == "M") {
        object = {
          id: item.id,
          handedIsTrueTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
        };
      }
      postData.push(object);
    });
    cb.rest.invokeFunction(
      "AT16A11A2C17080008.rule.updateBillData",
      {
        postData: postData,
        type: __data.type
      },
      function (err, res) {
        if (!err) {
          cb.utils.alert("操作成功");
          var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
          parentViewModel.execute("refresh"); //刷新父页面
        }
        viewModel.communication({
          type: "modal",
          payload: {
            data: false
          }
        });
      }
    );
  });
viewModel.on("customInit", function (data) {
  // 移交分配弹窗详情--页面初始化
});