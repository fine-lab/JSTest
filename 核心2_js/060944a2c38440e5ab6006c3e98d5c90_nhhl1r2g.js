viewModel.get("button64lh") &&
  viewModel.get("button64lh").on("click", function (data) {
    // 报单--单击
    //获取domainKey
    let domainKey = viewModel.getParams().domainKey;
    //一级客户报单,需要将客户替换成当前客户,所以这里需要获取到当前客户
    let agentId = viewModel.getParams().query.agentId;
    debugger;
    //获取销售订单列表选中的订单数据
    let selected = viewModel.getGridModel().getSelectedRows();
    if (selected.length > 0) {
      //增加单据状态控制，状态为开立态(value = 0)的不允许转单
      var falg = true;
      var dfalg = true;
      selected.forEach((record) => {
        //单据状态控制
        if (record.status == 0) {
          falg = false;
          cb.utils.alert("所选单据" + record.code + "状态为开立态，不允许报单", "warning");
          return;
        }
        //转单状态控制  headItem!define11
        if (record["headFreeItem!define11"]) {
          let define = record["headFreeItem!define11"] == "true" ? true : false;
          if (define) {
            dfalg = false;
            cb.utils.alert("所选单据" + record.code + "已报单，不允许重复报单", "warning");
            return;
          }
        }
      });
      if (falg && dfalg) {
        //弹窗->选择销售组织
        viewModel.communication({
          type: "modal",
          payload: {
            mode: "inner",
            groupCode: "modal7af",
            viewModel: viewModel
          }
        });
      }
    } else {
      cb.utils.alert("请至少选择一条单据", "warning");
    }
  });
//弹窗确定按钮事件
viewModel.on("afterOkClick", function (args) {
  const diworkCode = viewModel.getParams().diworkCode;
  if (args.key == "modal7af") {
    debugger;
    //选择的数据
    let currentSelectData = viewModel.getCache("childrenTableData"); //选择的转入组织
    let orderData = viewModel.getGridModel().getSelectedRows();
    cb.utils.loadingControl.start({ diworkCode }); //开启loading
    //获取token的函数之前的开发写死了API key,不敢改成传参数的，不知道会影响什么，先这样
    cb.rest.invokeFunction("c02a76987d874785b475c7cde58466d9", function (err, res) {
      if (err == null) {
        var access_token = res.access_token;
        //调用后端函数，后端函数调用销售订单新增OpenAPI,创建所选组织的销售订单
        let params = { org: currentSelectData, orderData: orderData, access_token: access_token };
        cb.rest.invokeFunction("c2fc8b43d0f44146825d8022da2281dc", params, function (err, res) {
          if (err == null) {
            if (res.resMsg.code != 200) {
              cb.utils.loadingControl.end({ diworkCode });
              cb.utils.alert(res.resMsg.message, "error");
            } else {
              cb.utils.loadingControl.end({ diworkCode });
              cb.utils.alert("转单成功", "success");
              //刷新界面
              viewModel.execute("refresh");
            }
          } else {
            cb.utils.loadingControl.end({ diworkCode });
            cb.utils.alert(JSON.stringify(err), "error");
          }
        });
      } else {
        cb.utils.loadingControl.end({ diworkCode }); //关闭loading
        cb.utils.alert(JSON.stringify(err), "error");
      }
    });
  }
});
viewModel.on("customInit", function (data) {
  // 订单列表--页面初始化
});
viewModel.get("button129zd") &&
  viewModel.get("button129zd").on("click", function (data) {
    debugger;
    // 费用冲抵--单击
    // 获取销售订单列表选中的订单数据
    let selected = viewModel.getGridModel().getSelectedRows();
    if (selected.length > 0) {
      //  获取token
      cb.rest.invokeFunction("c02a76987d874785b475c7cde58466d9", function (err, res) {
        if (err == null) {
          var access_token = res.access_token;
          for (var i = 0; i < selected.length; i++) {
            // 销售订单信息
            let params = { data: selected[i], access_token: access_token };
            cb.rest.invokeFunction("993412f4537a466297d3610c8d4ddc83", params, function (err, res) {
              if (err == null) {
              } else {
                cb.utils.alert(JSON.stringify(err), "error");
              }
            });
          }
        } else {
          cb.utils.alert(JSON.stringify(err), "error");
        }
      });
    } else {
      cb.utils.alert("请至少选择一条单据", "warning");
    }
  });