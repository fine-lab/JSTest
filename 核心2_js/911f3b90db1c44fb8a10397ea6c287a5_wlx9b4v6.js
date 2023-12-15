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
    var description = "资质合同收款" + "-" + data.code + "-" + data.qiyemingchen + "-" + data.hetonghao;
    //查询凭证是否存在  存在则不能再次生成
    var oldqijian = data.pingzhengzhujian;
    var oldcode = data.pingzhenghao;
    if (oldqijian !== undefined && oldcode !== undefined) {
      var vouchercheck = {
        pager: {
          pageIndex: "1",
          pageSize: "1"
        },
        description: description,
        accbookCode: hscode,
        periodStart: oldqijian,
        periodEnd: oldqijian,
        billcodeMin: oldcode,
        billcodeMax: oldcode
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
    var hetongleixing_name = data.hetongleixing_name;
    var qiyekubianma = data.qiyekubianma;
    var bodyhead = {
      srcSystemCode: "figl",
      accbookCode: hscode,
      voucherTypeCode: "1",
      attachedBill: "0",
      makeTime: data.shoukuanriqi,
      makerMobile: billid
    };
    //收款
    var jsonbs = [];
    var bvolist = data.ZZSKRYMXList;
    var shoukuanfangshi = data.shoukuanfangshi;
    var dailifei = data.dailifei;
    var shuifei = data.shuifei;
    var debitmoney;
    //判断代理费和税费，如果没有被定义那就让他们等于零
    if (dailifei === undefined && shuifei !== undefined) {
      debitmoney = data.shoukuanhuizong + shuifei;
    }
    if (dailifei !== undefined && shuifei === undefined) {
      debitmoney = data.shoukuanhuizong + dailifei;
    }
    if (dailifei !== undefined && shuifei !== undefined) {
      debitmoney = data.shoukuanhuizong + shuifei + dailifei;
    }
    if (dailifei === undefined && shuifei === undefined) {
      debitmoney = data.shoukuanhuizong;
    }
    //借方=总额+代理费+税费
    var shoukuanzhanghubianma = data.shoukuanzhanghubianma;
    var qiyekubianma = data.qiyekubianma;
    if (shoukuanfangshi === "1") {
      //现金
      var jsonbcredit = {
        //摘要
        description: description,
        //编码
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
    }
    if (shoukuanfangshi === "2" || shoukuanfangshi === "5") {
      //银行  //二维码
      var jsonbcredit = {
        //摘要
        description: description,
        //编码
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
            valueCode: shoukuanzhanghubianma
          }
        ]
      };
      jsonbs.push(jsonbcredit);
    }
    if (shoukuanfangshi === "3") {
      //第三方代收
      var jsonbcredit = {
        //摘要
        description: description,
        //编码
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
    //贷方
    if (shuifei !== 0) {
      //其他业务收入-税金收入
      var jsonbdebit1 = {
        //摘要
        description: description,
        //会计科目：税金收入
        accsubjectCode: "505102",
        //汇率类型
        rateType: "01",
        //汇率
        rateOrg: "1.00",
        //贷方金额
        creditOriginal: shuifei,
        creditOrg: shuifei,
        clientAuxiliaryList: [
          {
            filedCode: "008",
            valueCode: "012" //合同类型编码
          }
        ]
      };
      jsonbs.push(jsonbdebit1);
    }
    if (dailifei !== 0) {
      //其他业务收入-代理费
      var jsonbdebit2 = {
        //摘要
        description: description,
        //会计科目：代理费收入
        accsubjectCode: "505103",
        //汇率类型
        rateType: "01",
        //汇率
        rateOrg: "1.00",
        //贷方金额
        creditOriginal: dailifei,
        creditOrg: dailifei,
        clientAuxiliaryList: [
          {
            filedCode: "008",
            valueCode: "012" //合同类型编码
          }
        ]
      };
      jsonbs.push(jsonbdebit2);
    }
    for (let j = 0; j < bvolist.length; j++) {
      var bvo1 = bvolist[j];
      if (bvolist !== undefined) {
        var jiyingshou = bvo1.caiwujiyingshou;
        var jishouru = bvo1.caiwujishouru;
        if (jiyingshou === 0 && jishouru === 0 && jiyingshou === undefined && jishouru === undefined) {
          continue;
        }
        //记应收≠0且记收入=0   +"-核销应收"
        if (jiyingshou !== 0 && jishouru === 0) {
          var jsonbdebit = {
            //摘要
            description: description,
            //会计科目：应收账款
            accsubjectCode: "1122",
            //汇率类型
            rateType: "01",
            //汇率
            rateOrg: "1.00",
            //贷方金额
            creditOriginal: jiyingshou,
            creditOrg: jiyingshou,
            clientAuxiliaryList: [
              {
                filedCode: "012",
                valueCode: qiyekubianma
              }
            ]
          };
          jsonbs.push(jsonbdebit);
        }
        //记应收≠0且记收入≠0    +"-核销应收确认收入"
        if (jiyingshou !== 0 && jishouru !== 0) {
          //应收账款
          var jsonbdebit1 = {
            //摘要
            description: description,
            //会计科目：应收账款
            accsubjectCode: "1122",
            //汇率类型
            rateType: "01",
            //汇率
            rateOrg: "1.00",
            //贷方金额
            creditOriginal: jiyingshou,
            creditOrg: jiyingshou,
            clientAuxiliaryList: [
              {
                filedCode: "012",
                valueCode: qiyekubianma
              }
            ]
          };
          jsonbs.push(jsonbdebit1);
          //主营业务收入
          var jsonbdebit2 = {
            //摘要
            description: description,
            //会计科目：应收账款
            accsubjectCode: "5001",
            //汇率类型
            rateType: "01",
            //汇率
            rateOrg: "1.00",
            //贷方金额
            creditOriginal: jishouru,
            creditOrg: jishouru,
            clientAuxiliaryList: [
              {
                filedCode: "008",
                valueCode: "012" //合同类型编码
              }
            ]
          };
          jsonbs.push(jsonbdebit2);
        }
        //记应收=0且记收入≠0
        if (jiyingshou === 0 && jishouru !== 0) {
          //主营业务收入
          var jsonbdebit1 = {
            //摘要
            description: description,
            //会计科目：主营业务收入
            accsubjectCode: "5001",
            //汇率类型
            rateType: "01",
            //汇率
            rateOrg: "1.00",
            //贷方金额
            creditOriginal: jishouru,
            creditOrg: jishouru,
            clientAuxiliaryList: [
              {
                filedCode: "008",
                valueCode: "012" //合同类型编码
              }
            ]
          };
          jsonbs.push(jsonbdebit1);
        }
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
      var retobj = ObjectStore.updateById("GT57700AT57.GT57700AT57.QTZZSK", object);
    }
    return { period: period, vouchercode: vouchercode, retobj: retobj };
  }
}
exports({ entryPoint: MyAPIHandler });