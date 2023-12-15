let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取token
    //多张单据
    var data = request.data;
    var userid = request.userid;
    var token = "";
    let func1 = extrequire("GT56492AT34.backDefaultGroup.gettoken"); //?
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
    var description = "完结审批" + "-" + data.code + "-" + data.qiyemingchen_id + "-" + data.hetonghao;
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
    var hetongleixing_name = data.hetongleixing_name;
    var qiyekubianma = data.qiyekubianma;
    var bodyhead = {
      srcSystemCode: "figl",
      accbookCode: hscode,
      voucherTypeCode: "1",
      attachedBill: "0",
      makerMobile: billid
    };
    //付款
    var jsonbs = [];
    //借方
    var debitmoney = data.jine; //借方金额
    var jsonbdebit = {
      //摘要
      description: description,
      //会计科目：应收账款
      accsubjectCode: "1122",
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
          valueCode: data.qiyekubianma
        }
      ]
    };
    jsonbs.push(jsonbdebit);
    //贷方
    var creditmoney = data.jine; //贷方金额
    var jsonbdebit = {
      //摘要
      description: description,
      //会计科目：主营业务收入
      accsubjectCode: "5001",
      //汇率类型
      rateType: "01",
      //汇率
      rateOrg: "1.00",
      //借方金额
      creditOriginal: creditmoney,
      creditOrg: creditmoney,
      clientAuxiliaryList: [
        {
          filedCode: "008",
          valueCode: "013" //合同类型编码
        }
      ]
    };
    jsonbs.push(jsonbdebit);
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
      var retobj = ObjectStore.updateById("GT57393AT53.GT57393AT53.QTWJSP", object);
    }
    return { period: period, vouchercode: vouchercode, retobj: retobj };
  }
}
exports({ entryPoint: MyAPIHandler });