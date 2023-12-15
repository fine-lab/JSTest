viewModel.get("button280bg") &&
  viewModel.get("button280bg").on("click", function (data) {
    // 发送快递--单击
    const id = viewModel.get("id").getValue();
    let responsebs = "";
    //调用api函数查询销售出库数据
    let response = cb.rest.invokeFunction("ST.backOpenApiFunction.getSaleOutData", { id: id }, function (err, res) {}, viewModel, { async: false });
    if (response.error) {
      cb.utils.alert(response.error.message);
      return false;
    } else {
      var bill = response.result.bill;
      let responseData = response.result;
      if (bill.def1 != null) {
        cb.utils.alert("该用户快递单号已存在");
        return false;
      } else if (bill.def2 == "申通") {
        responseSt = cb.rest.invokeFunction("ST.backOpenApiFunction.STOAPI", { responseData: responseData }, function (err, res) {}, viewModel, { async: false });
        viewModel.execute("refresh");
      } else if (bill.def2 == "韵达") {
        responseYd = cb.rest.invokeFunction("ST.backOpenApiFunction.yunda", { responseData: responseData }, function (err, res) {}, viewModel, { async: false });
        viewModel.execute("refresh");
      } else if (bill.def2 == "圆通") {
        responseYt = cb.rest.invokeFunction("ST.backOpenApiFunction.ytktApi", { responseData: responseData }, function (err, res) {}, viewModel, { async: false });
        let cgbm = responseYt.result.js;
        let Code = cgbm.code;
        if (Code != 200010003) {
          cb.utils.confirm("发送成功");
          viewModel.execute("refresh");
        } else {
          let cwxx = cgbm.reason;
          cb.utils.alert("此信息" + cwxx);
          viewModel.execute("refresh");
        }
      } else if (bill.def2 == "百世汇通") {
        responsebs = cb.rest.invokeFunction("ST.backOpenApiFunction.apilwy0222", { responseData: responseData }, function (err, res) {}, viewModel, { async: false });
        var RESB = responsebs.result.strResponse;
        var RESB1 = JSON.parse(RESB);
        var RESB2 = RESB1.resultCode;
        if (RESB2 == "1000") {
          var strR = responsebs.result.strResponse;
          var str1 = JSON.parse(strR);
          var str11 = str1.logisticID;
          var responsebs1 = cb.rest.invokeFunction("ST.backOpenApiFunction.BSTH02API", { str11: str11 }, function (err, res) {}, viewModel, { async: false });
          var code = responsebs1.result.response1.orderTraceList[0].code;
          viewModel.get("headDefine!define1").setValue(code);
          cb.utils.alert("百世快递:" + JSON.stringify(responsebs));
        } else {
          cb.utils.confirm("该订单号已生成,不需要生成订单");
          return false;
        }
      } else if (bill.def2 == "顺丰") {
        var sfRes = cb.rest.invokeFunction("ST.SF.sendDataToSF", { billData: bill }, function (err, res) {}, viewModel, { async: false });
        if (sfRes.error) {
          cb.utils.alert("发送顺丰快递失败：" + sfRes.error.message, "error");
          return false;
        }
        cb.utils.alert("发送顺丰快递成功!");
        viewModel.execute("refresh");
      } else if (bill.def2 == "中通") {
        responseZT = cb.rest.invokeFunction("ST.backOpenApiFunction.ZTkdAPI", { responseData: responseData }, function (err, res) {}, viewModel, { async: false });
        cb.utils.alert("发送成功");
        viewModel.execute("refresh");
      } else {
        cb.utils.alert("快递类型错误,请检查!");
        return false;
      }
    }
  });
viewModel.get("button246tj") &&
  viewModel.get("button246tj").on("click", function (data) {
    const id = viewModel.get("id").getValue();
    //调用api函数查询销售出库数据
    let response = cb.rest.invokeFunction("ST.backOpenApiFunction.getSaleOutData", { id: id }, function (err, res) {}, viewModel, { async: false });
    if (response.error) {
      cb.utils.alert(response.error.message);
      return false;
    } else {
      var s1 = response.result.bill.def2; //快递类型
      var s2 = response.result.bill.def1; //快递单号
      if (s2 == null) {
        cb.utils.alert("该快递单号不存在,无法查询快递");
      } else {
        if (s1 == "申通") {
          var data2 = cb.rest.invokeFunction("ST.backOpenApiFunction.STOAPI2", { data1: s2 }, function (err, res) {}, viewModel, { async: false });
          cb.utils.confirm(data2.result.result);
        } else if (s1 == "韵达") {
          var responseYd = cb.rest.invokeFunction("ST.backOpenApiFunction.dingdanguijing", { response: s2 }, function (err, res) {}, viewModel, { async: false });
          var kbm = responseYd.code;
          if (kbm == 1001) {
            cb.utils.confirm("还没有此订单的信息");
          }
        } else if (s1 == "圆通") {
          var responseYt = cb.rest.invokeFunction(
            "ST.backOpenApiFunction.yuktChaXun",
            { response: s2 },
            function (err, res) {},
            viewModel,
            { async: false }
          );
          var kbm = responseYt.jsgs.code;
          if (kbm == 1001) {
            cb.utils.confirm("还没有此订单的信息");
          }
        } else if (s1 == "百世汇通") {
          var sss = cb.rest.invokeFunction(
            "ST.backOpenApiFunction.cxkdlwy",
            { s2: s2 },
            function (err, res) {},
            viewModel,
            { async: false }
          );
          cb.utils.confirm(sss.result.a1);
        } else if (s1 == "顺丰") {
          let sfRes = cb.rest.invokeFunction("ST.SF.querySFAPI", { num: s2 }, function (err, res) {}, viewModel, { async: false });
          if (sfRes.error) {
            cb.utils.alert("查询失败," + sfRes.error.message);
            return false;
          } else {
            let outmessage = sfRes.result.message;
            cb.utils.confirm(outmessage);
          }
        } else if (s1 == "中通") {
          var zt = cb.rest.invokeFunction(
            "ST.backOpenApiFunction.ZongTongSelect",
            { response: s2 },
            function (err, res) {},
            viewModel,
            { async: false }
          );
          cb.utils.confirm(zt.result.message);
        } else {
          cb.utils.alert("快递类型错误,请检查!");
          return false;
        }
      }
    }
  });
viewModel.on("customInit", function (data) {
  // 销售出库单--页面初始化
});