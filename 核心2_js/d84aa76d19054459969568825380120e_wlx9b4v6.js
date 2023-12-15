let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取token
    //多张单据
    var data = request.data;
    var userid = request.userid;
    var token = "";
    let func1 = extrequire("GT56492AT34.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    //查询用户手机号
    let headeriphone = {
      "Content-Type": hmd_contenttype,
      noCipherFlag: true
    };
    var bodyhead = {
      userIds: [userid]
    };
    let apiResponse_iphone = postman("post", "https://www.example.com/" + token, JSON.stringify(headeriphone), JSON.stringify(bodyhead));
    var apiResponse1json_iphone = JSON.parse(apiResponse_iphone);
    var queryCode_iphone = apiResponse1json_iphone.code;
    if (queryCode_iphone !== "200") {
      throw new Error("错误" + apiResponse1json_iphone.message + JSON.stringify(bodyhead));
    } else {
      var billid = apiResponse1json_iphone.data[0].userMobile;
    }
    var hscode = data.zhangbubianma;
    var id = data.id;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    //判断合同类型
    var valueCode = data.hetongleixing_name;
    var description = "晴天付款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetong;
    var hetongleixing_name = data.hetongleixing_name;
    var type = 0;
    if (hetongleixing_name === "晴天继续教育合同") {
      description = "继续教育付款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetong;
      valueCode = "001";
      type = 1;
    } else if (hetongleixing_name === "晴天职称合同") {
      description = "职称付款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetong;
      valueCode = "004";
      type = 1;
    } else if (hetongleixing_name === "晴天考培取证合同") {
      description = "考培取证付款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetong;
      valueCode = "002";
      type = 1;
    } else if (hetongleixing_name === "晴天体系合同") {
      description = "体系付款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetong;
      valueCode = "005";
      type = 1;
    } else if (hetongleixing_name === "晴天学历及网课合同") {
      description = "学历及网课付款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetong;
      valueCode = "003";
      type = 1;
    } else if (hetongleixing_name === "晴天代理记账合同") {
      description = "代理记账付款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetong;
      valueCode = "006";
      type = 1;
    }
    //查询凭证是否存在  存在则不能再次生成
    var oldqijian = data.pingzhengzhujian;
    var oldcode = data.pingzhenghao;
    if (oldqijian !== undefined && oldcode !== undefined) {
      var vouchercheck = {
        pager: {
          pageIndex: "1",
          pageSize: "1"
        },
        accbookCode: hscode,
        periodStart: oldqijian,
        periodEnd: oldqijian,
        billcodeMin: oldcode,
        billcodeMax: oldcode,
        description: description
      };
      let ctcheckpon = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(vouchercheck));
      var ctcheckponjson = JSON.parse(ctcheckpon);
      var ctcheckcode = ctcheckponjson.code;
      if (ctcheckcode !== "200") {
        throw new Error("查询凭证错误" + ctcheckponjson.message + JSON.stringify(vouchercheck));
      } else {
        var ctcount = ctcheckponjson.data.recordCount;
        if (ctcount !== 0) {
          throw new Error("错误,已生成凭证");
        }
      }
    }
    var qiyekubianma = data.qiyekubianma;
    var bodyhead = {
      srcSystemCode: "figl",
      accbookCode: hscode,
      voucherTypeCode: "1",
      attachedBill: "0",
      makeTime: data.fukuanriqi,
      makerMobile: billid
    };
    var fukuanleixing = data.fukuanleixing;
    var debitmoney = data.fukuanzongji; //借方金额
    var creditmoney = data.fukuanzongji;
    var fukuanfangshi = data.fukuanfangshi;
    var fukuanzhanghubianma = data.fukuanzhanghubianma;
    if (fukuanleixing !== "5") {
      //付款
      var jsonbs = [];
      //借方
      var jsonbdebit = {
        //摘要
        description: description,
        //会计科目主营业务成本
        accsubjectCode: "5401",
        //汇率类型
        rateType: "01",
        //汇率
        rateOrg: "1.00",
        //借方金额
        debitOriginal: debitmoney,
        debitOrg: debitmoney,
        clientAuxiliaryList: [
          {
            filedCode: "008",
            valueCode: valueCode
          }
        ]
      };
      jsonbs.push(jsonbdebit);
      //贷方
      if (fukuanfangshi === "1") {
        //库存现金
        var jsonbcredit = {
          //摘要
          description: description,
          //会计科目编码
          accsubjectCode: "1001",
          //汇率类型
          rateType: "01",
          //汇率
          rateOrg: "1.00",
          //贷方金额
          creditOriginal: creditmoney,
          creditOrg: creditmoney
        };
        jsonbs.push(jsonbcredit);
      } else if (fukuanfangshi === "2") {
        //银行存款
        var jsonbcredit = {
          //摘要
          description: description,
          //会计科目编码
          accsubjectCode: "1002",
          //汇率类型
          rateType: "01",
          //汇率
          rateOrg: "1.00",
          //贷方金额
          creditOriginal: creditmoney,
          creditOrg: creditmoney,
          clientAuxiliaryList: [
            {
              filedCode: "011",
              valueCode: fukuanzhanghubianma
            }
          ]
        };
        jsonbs.push(jsonbcredit);
      } else if (fukuanfangshi === "3") {
        //第三方代收
        var jsonbcredit = {
          //摘要
          description: description,
          //会计科目编码
          accsubjectCode: "2202",
          //汇率类型
          rateType: "01",
          //汇率
          rateOrg: "1.00",
          //贷方金额
          creditOriginal: creditmoney,
          creditOrg: creditmoney,
          clientAuxiliaryList: [
            {
              filedCode: "012",
              valueCode: qiyekubianma
            }
          ]
        };
        jsonbs.push(jsonbcredit);
      }
    } else {
      //退款
      var jsonbs = [];
      //借方
      var jsonbdebit = {
        //摘要
        description: description + "-退款",
        //会计科目主营业务收入
        accsubjectCode: "5001",
        //汇率类型
        rateType: "01",
        //汇率
        rateOrg: "1.00",
        //借方金额
        debitOriginal: debitmoney,
        debitOrg: debitmoney,
        clientAuxiliaryList: [
          {
            filedCode: "008",
            valueCode: valueCode
          }
        ]
      };
      jsonbs.push(jsonbdebit);
      //贷方
      if (fukuanfangshi === "1") {
        //库存现金
        var jsonbcredit = {
          //摘要
          description: description + "-退款",
          //会计科目编码
          accsubjectCode: "1001",
          //汇率类型
          rateType: "01",
          //汇率
          rateOrg: "1.00",
          //贷方金额
          creditOriginal: creditmoney,
          creditOrg: creditmoney
        };
        jsonbs.push(jsonbcredit);
      } else if (fukuanfangshi === "2") {
        //银行存款
        var jsonbcredit = {
          //摘要
          description: description + "-退款",
          //会计科目编码
          accsubjectCode: "1002",
          //汇率类型
          rateType: "01",
          //汇率
          rateOrg: "1.00",
          //贷方金额
          creditOriginal: creditmoney,
          creditOrg: creditmoney,
          clientAuxiliaryList: [
            {
              filedCode: "011",
              valueCode: fukuanzhanghubianma
            }
          ]
        };
        jsonbs.push(jsonbcredit);
      } else if (fukuanfangshi === "3") {
        //第三方代收
        var jsonbcredit = {
          //摘要
          description: description + "-退款",
          //会计科目编码其他应收
          accsubjectCode: "1221",
          //汇率类型
          rateType: "01",
          //汇率
          rateOrg: "1.00",
          //贷方金额
          creditOriginal: creditmoney,
          creditOrg: creditmoney,
          clientAuxiliaryList: [
            {
              filedCode: "012",
              valueCode: qiyekubianma
            }
          ]
        };
        jsonbs.push(jsonbcredit);
      }
    }
    bodyhead.bodies = jsonbs;
    var jsonjson = JSON.stringify(bodyhead);
    let apiResponse1ct = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(bodyhead));
    var apiResponse1jsonct = JSON.parse(apiResponse1ct);
    var queryCode1ct = apiResponse1jsonct.code;
    if (queryCode1ct !== "200") {
      throw new Error("保存错误" + apiResponse1jsonct.message + JSON.stringify(bodyhead));
    } else {
      var period = apiResponse1jsonct.data.period;
      var vouchercode = apiResponse1jsonct.data.billCode + "";
      var voucherstr = apiResponse1jsonct.data.voucherType.voucherstr;
      var object = { id: id, pingzhengzhujian: period, pingzhenghao: vouchercode };
      var retobj = ObjectStore.updateById("GT57020AT46.GT57020AT46.QTFK", object);
    }
    return { period: period, vouchercode: vouchercode, retobj: retobj };
  }
}
exports({ entryPoint: MyAPIHandler });