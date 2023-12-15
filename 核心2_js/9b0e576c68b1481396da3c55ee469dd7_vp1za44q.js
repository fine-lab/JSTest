viewModel.get("button4oh") &&
  viewModel.get("button4oh").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button10zi") &&
  viewModel.get("button10zi").on("click", function (data) {
    // 确认--单击
    debugger;
    //类型
    const value1 = viewModel.get("qingchuleixing").getValue();
    //单号
    const valuenumber = viewModel.get("danhao").getValue();
    if (value1 == undefined) {
      cb.utils.alert(" -- 请输入所要清除的类型 -- ");
      return;
    }
    if (valuenumber == undefined) {
      cb.utils.alert(" -- 请输入所对应类型的单号 --");
      return;
    }
    const value2 = valuenumber.replace(/[, ]/g, "");
    if (value1 == "1") {
      //材料出库单
      var sdPAN = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.selMaterials", { OddNumbers: value2 }, function (err, res) {}, viewModel, { async: false });
      if (sdPAN.error) {
        cb.utils.alert(sdPAN.error.message, "error");
      } else {
        //清除失败的ID失败数据;
        var sbId = [];
        //获取到所有生成材料出库的id。
        var allId = sdPAN.result.resSon;
        var groupId = splitId(allId, 100);
        var newgroup = groupId.newList;
        for (var i = 0; i < newgroup.length; i++) {
          var groupList = newgroup[i];
          var updatePlClera = cb.rest.invokeFunction("AT15F164F008080007.jcdd.updateplClear", { idlist: groupList }, function (err, res) {}, viewModel, { async: false });
          if (updatePlClera.error) {
            sbId.push(groupList);
          }
        }
        if (sbId.length != 0) {
          cb.utils.confirm(" -- 表中材料出库单号: " + value2 + " 清除失败，ID为：\n" + sbId);
        } else {
          viewModel.execute("refresh");
          cb.utils.alert(" -- 表中材料出库单号: " + value2 + " 清除成功 -- ", "success");
        }
      }
    } else if (value1 == "2") {
      //采购订单
      var cgPAN = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.selPurchase", { OddNumbers: value2 }, function (err, res) {}, viewModel, { async: false });
      if (cgPAN.error) {
        cb.utils.alert(cgPAN.error.message);
      } else {
        var type = cgPAN.result.BillNo.type; //true为表体 表头为 false
        if (type) {
          //清除表体采购订单号
          //清除失败的ID失败数据;
          var sbId = [];
          //获取到所有生成材料出库的id。
          var allId = cgPAN.result.BillNo.BodyList;
          var groupId = splitId(allId, 100);
          var newgroup = groupId.newList;
          for (var i = 0; i < newgroup.length; i++) {
            var groupList = newgroup[i];
            var updatePlClera = cb.rest.invokeFunction("AT15F164F008080007.jcdd.ClearPO", { idlist: groupList }, function (err, res) {}, viewModel, { async: false });
            if (updatePlClera.error) {
              sbId.push(groupList);
            }
          }
          if (sbId.length != 0) {
            cb.utils.confirm(" -- 清除【采购订单】单号: " + value2 + " 清除失败，ID为：\n" + sbId);
          } else {
            viewModel.execute("refresh");
            cb.utils.alert(" -- 清除【采购订单】单号: " + value2 + " 清除成功 -- ", "success");
          }
        } else {
          //清除表头采购订单号
          //清除失败的ID失败数据;
          var sbId = [];
          //获取到所有生成材料出库的id。
          var allId = cgPAN.result.BillNo.BodyList;
          var groupId = splitId(allId, 100);
          var newgroup = groupId.newList;
          for (var i = 0; i < newgroup.length; i++) {
            var groupList = newgroup[i];
            var updatePlClera = cb.rest.invokeFunction("AT15F164F008080007.jcdd.ClearPOTou", { idlist: groupList }, function (err, res) {}, viewModel, { async: false });
            if (updatePlClera.error) {
              sbId.push(groupList);
            }
          }
          if (sbId.length != 0) {
            cb.utils.confirm(" -- 清除【采购订单】单号: " + value2 + " 清除失败，ID为：\n" + sbId);
          } else {
            viewModel.execute("refresh");
            cb.utils.alert(" -- 清除【采购订单】单号: " + value2 + " 清除成功 -- ", "success");
          }
        }
      }
    } else if (value1 == "3") {
      //成本凭证
      //会计期间
      const periodDate = viewModel.get("periodDate").getValue();
      var cbdPAN = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.selVoucher", { OddNumbers: value2, Date: periodDate }, function (err, res) {}, viewModel, { async: false });
      if (cbdPAN.error) {
        cb.utils.alert(cbdPAN.error.message);
      } else {
        var sbId = [];
        //获取到所有的样本编号；
        var allCode = cbdPAN.result.codelist;
        var groupCode = splitId(allCode, 100);
        var newgroup = groupCode.newList;
        for (var i = 0; i < newgroup.length; i++) {
          var groupList = newgroup[i];
          var updatePlClera = cb.rest.invokeFunction("AT15F164F008080007.backWorkflowFunction.cleanCb", { idlist: groupList }, function (err, res) {}, viewModel, { async: false });
          if (updatePlClera.error) {
            sbId.push(groupList);
          }
        }
        if (sbId.length != 0) {
          cb.utils.alert(" -- 表中成本凭证号: " + value2 + " 清除失败 -- ");
          viewModel.execute("refresh");
        } else {
          cb.utils.alert(" -- 表中成本凭证号: " + value2 + " 清除成功 -- ");
          viewModel.execute("refresh");
        }
      }
    } else if (value1 == "4") {
      //收入凭证
      //会计期间
      const periodDate = viewModel.get("periodDate").getValue();
      var sdPAN = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.seIIncome", { OddNumbers: value2, Date: periodDate }, function (err, res) {}, viewModel, { async: false });
      if (sdPAN.error) {
        cb.utils.alert(sdPAN.error.message);
      } else {
        //获取到所有的样本编号；
        var sbId = [];
        var allCode = sdPAN.result.codelist;
        var groupCode = splitId(allCode, 100);
        var newgroup = groupCode.newList;
        for (var i = 0; i < newgroup.length; i++) {
          var groupList = newgroup[i];
          var updatePlClera = cb.rest.invokeFunction("AT15F164F008080007.backWorkflowFunction.Deathpzh", { idlist: groupList }, function (err, res) {}, viewModel, { async: false });
          if (updatePlClera.error) {
            sbId.push(groupList);
          }
        }
        if (sbId.length != 0) {
          cb.utils.alert(" -- 表中收入凭证号: " + value2 + " 清除失败");
          viewModel.execute("refresh");
        } else {
          cb.utils.alert(" -- 表中收入凭证号: " + value2 + " 清除成功 -- ");
          viewModel.execute("refresh");
        }
      }
    }
    //关闭
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
function splitId(allid, num) {
  var newList = new Array();
  for (var i = 0; i < allid.length; i += num) {
    const resList = allid.slice(i, i + num);
    newList.push(resList);
  }
  return { newList };
}