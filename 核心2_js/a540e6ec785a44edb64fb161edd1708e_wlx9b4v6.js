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
    var valueCode = data.hetongleixing_name;
    var description = "晴天收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
    var hetongleixing_name = data.hetongleixing_name;
    var type = 0;
    //判断合同类型
    if (hetongleixing_name === "晴天继续教育合同") {
      description = "继续教育收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
      valueCode = "001";
      type = 1;
    } else if (hetongleixing_name === "晴天职称合同") {
      description = "职称收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
      valueCode = "004";
      type = 1;
    } else if (hetongleixing_name === "晴天考培取证合同") {
      description = "考培取证收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
      valueCode = "002";
      type = 1;
    } else if (hetongleixing_name === "晴天体系合同") {
      description = "体系收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
      valueCode = "005";
      type = 1;
    } else if (hetongleixing_name === "晴天学历及网课合同") {
      description = "学历及网课收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
      valueCode = "003";
      type = 1;
    } else if (hetongleixing_name === "晴天代理记账合同") {
      description = "代理记账收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
      valueCode = "006";
      type = 1;
    } else if (hetongleixing_name === "建造师合同") {
      description = "建造师收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
      valueCode = "016";
      type = 1;
    } else if (hetongleixing_name === "建造师合同") {
      description = "其他收款" + "-" + data.code + "-" + data.gongsimingchen_gongsimingchen + "-" + data.hetonghao + "-" + data.duifangdakuanzhanghu;
      valueCode = "017";
      type = 1;
    }
    //查询凭证是否存在  存在则不能再次生成
    var oldqijian = data.new16;
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
      makeTime: data.shoukuanshijian,
      makerMobile: billid
    };
    //收款
    var jsonbs = [];
    //借方
    var jiesuanfangshi = data.jiesuanfangshi;
    var debitmoney = data.shoukuanheji;
    if (jiesuanfangshi === "1") {
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
        //借方金额
        debitOriginal: debitmoney,
        debitOrg: debitmoney
      };
      jsonbs.push(jsonbcredit);
    } else if (jiesuanfangshi === "2" || jiesuanfangshi === "5") {
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
        //借方金额
        debitOriginal: debitmoney,
        debitOrg: debitmoney,
        clientAuxiliaryList: [
          {
            filedCode: "011",
            valueCode: data.shoukuanzhanghubianma
          }
        ]
      };
      jsonbs.push(jsonbcredit);
    } else if (jiesuanfangshi === "3") {
      //第三方代收
      var jsonbcredit = {
        //摘要
        description: description,
        //会计科目编码
        accsubjectCode: "1221",
        //汇率类型
        rateType: "01",
        //汇率
        rateOrg: "1.00",
        //借方金额
        debitOriginal: debitmoney,
        debitOrg: debitmoney,
        clientAuxiliaryList: [
          {
            filedCode: "012",
            valueCode: qiyekubianma
          }
        ]
      };
      jsonbs.push(jsonbcredit);
    }
    //贷方税金
    var creditmoney1 = data.shuifei; //贷方金额
    if (0 !== creditmoney1) {
      var jsonbdebit1 = {
        //摘要
        description: description,
        //会计科目
        accsubjectCode: "505102",
        //汇率类型
        rateType: "01",
        //汇率
        rateOrg: "1.00",
        //贷方金额
        creditOriginal: creditmoney1,
        creditOrg: creditmoney1,
        clientAuxiliaryList: [
          {
            filedCode: "008",
            valueCode: valueCode
          }
        ]
      };
      jsonbs.push(jsonbdebit1);
    }
    //贷方其他业务收入
    var creditmoney2 = data.shoukuanheji - data.shuifei; //贷方金额
    var jsonbdebit2 = {
      //摘要
      description: description,
      //会计科目主营业务收入
      accsubjectCode: "505101",
      //汇率类型
      rateType: "01",
      //汇率
      rateOrg: "1.00",
      //贷方金额
      creditOriginal: creditmoney2,
      creditOrg: creditmoney2,
      clientAuxiliaryList: [
        {
          filedCode: "008",
          valueCode: valueCode
        }
      ]
    };
    jsonbs.push(jsonbdebit2);
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
      var object = { id: id, new16: period, pingzhenghao: vouchercode };
      var retobj = ObjectStore.updateById("GT56762AT44.GT56762AT44.QTshoukuan", object);
    }
    return { period: period, vouchercode: vouchercode, retobj: retobj };
  }
}
exports({ entryPoint: MyAPIHandler });