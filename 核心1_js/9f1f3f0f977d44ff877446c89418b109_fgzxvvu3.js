viewModel.get("item52rd") &&
  viewModel.get("item52rd").on("blur", function (data) {
    console.log("asdf");
    // 销售订单号--失去焦点的回调
    const value = viewModel.get("item52rd").getValue();
    if (null != value) {
      viewModel.get("item105wf").setDisabled(true);
    } else {
      viewModel.get("item105wf").setDisabled(false);
    }
  });
viewModel.get("item105wf") &&
  viewModel.get("item105wf").on("blur", function (data) {
    // 发货单号--失去焦点的回调
    const value = viewModel.get("item105wf").getValue();
    if (null != value) {
      viewModel.get("item52rd").setDisabled(true);
    } else {
      viewModel.get("item52rd").setDisabled(false);
    }
  });
viewModel.get("watchhead_1666602986624253954") &&
  viewModel.get("watchhead_1666602986624253954").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    viewModel.get("watchhead_1666602986624253954").clear();
  });
viewModel.get("button6pi") &&
  viewModel.get("button6pi").on("click", function (data) {
    // 搜索--单击
    const inOrderCode = viewModel.get("item52rd").getValue(); // 销售订单号
    const inDeliveryCode = viewModel.get("item105wf").getValue(); // 发货单号
    var targetType = null;
    var targetCode = null;
    if (null == inOrderCode && null == inDeliveryCode) {
      cb.utils.alert({
        title: "至少输入一个参数",
        type: "warning",
        duration: "3",
        mask: true
      });
      return;
    } else if (null == inOrderCode) {
      targetType = "1";
      targetCode = inDeliveryCode;
    } else if (null == inDeliveryCode) {
      targetType = "2";
      targetCode = inOrderCode;
    }
    let inData = {
      targetType: targetType,
      targetCode: targetCode
    };
    // 获取销售订单与发货单
    let resXIShuAll = cb.rest.invokeFunction("3acd9c3327384967912c70e1122cfdba", inData, null, viewModel, {
      async: false
    });
    var deliveryArr = resXIShuAll.result.deliveryArr;
    var order = resXIShuAll.result.order;
    var inData_2 = null;
    if (targetType == "1") {
      // 通过发货单查询
      if (null == deliveryArr) {
        cb.utils.alert({
          title: "未查到发货单数据",
          type: "warning",
          duration: "3",
          mask: true
        });
        return;
      }
      let delivery = deliveryArr[0];
      inData_2 = {
        targetType: "1",
        delivery: delivery,
        order: order
      };
    } else if (targetType == "2") {
      // 通过销售单查询
      if (null != order && null != deliveryArr && 1 < deliveryArr.length) {
        var mess = "该销售订单查出多条出货单：\n";
        for (var y = deliveryArr.length - 1; y >= 0; y--) {
          mess = mess + deliveryArr[y].code + "\n";
        }
        mess = mess + "请输入发货单查询！";
        cb.utils.confirm(mess, [
          {
            text: "确定"
          }
        ]);
        return;
      } else if (null == order) {
        cb.utils.alert({
          title: "未查到销售订单数据",
          type: "warning",
          duration: "3",
          mask: true
        });
        return;
      }
      // 出库单只关联销售订单
      if (null == deliveryArr || 0 == deliveryArr.length) {
        inData_2 = {
          targetType: "2",
          order: order
        };
      } else {
        inData_2 = {
          targetType: "1",
          order: order,
          delivery: deliveryArr[0]
        };
      }
    }
    debugger;
    // 获取销售出库单
    let salesOutRes = cb.rest.invokeFunction("b97fdb5ad0b8405ea51b96a73b04c48f", inData_2, null, viewModel, {
      async: false
    });
    var mainDataArr = salesOutRes.result.mainDataArr;
    if (mainDataArr.length == 0) {
      cb.utils.alert({
        title: "未查到出库数据！",
        type: "warning",
        duration: "3",
        mask: true
      });
      return;
    }
    // 数据合并
    let merge = cb.rest.invokeFunction("57c7a509e37d45adb9e01b04e5886ca4", mainDataArr, null, viewModel, {
      async: false
    });
    if (null == merge.result.mergeArr || 0 == merge.result.mergeArr.length) {
      return;
    }
    // 出库单存到数据库
    var resultData = cb.rest.invokeFunction("ae55eefa9fde4a7ca8f795a95a4ea95f", merge.result.mergeArr, null, viewModel, {
      async: false
    });
    if (null == resultData) {
      return;
    }
    // 列表数据渲染
    const gridModel = viewModel.get("watchhead_1666602986624253954");
    gridModel.clear();
    var object = resultData.result;
    gridModel.appendRow({
      makeCode: object.makeCode, // 组合code
      id: object.id, // 数据id
      kehumingchen: object.kehumingchen, // 客户名称
      kehubianma: object.kehubianma, // 客户编码
      shouhuodizhi: object.shouhuodizhi, // 收货地址
      shouhuodianhua: object.shouhuodianhua, // 收货电话
      yewuyuan: object.yewuyuan, // 业务员
      beizhu: object.beizhu, // 备注
      xiaoshoudingdanhao: object.xiaoshoudingdanhao, // 销售订单号
      deliveryCode: object.deliveryCode, // 销售发货单号
      xiaoshouriqi: object.xiaoshouriqi, // 销售日期
      fahuoriqi: object.fahuoriqi, // 发货日期
      // 暂时不取 不存
      dayincishu: object.dayincishu, // 打印次数
      zhidanren: object.zhidanren, // 制单人
      jianhuoren: object.jianhuoren, // 拣货人
      fuheren: object.fuheren, // 复核人
      fahuoren: object.fahuoren // 发货人
    });
  });