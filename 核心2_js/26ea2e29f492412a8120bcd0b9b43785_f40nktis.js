let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dateApi = extrequire("AT18EBC24C08E00004.util.getYearMonth");
    let dateResult = dateApi.execute(null, new Date(new Date().getTime() + 28800000));
    let dataNow = dateResult.dateView.substring(0, 7);
    throw new Error("当前年月日：" + dataNow);
    var sqlBiaotou =
      "select *,zi.taxrate as taxrateZi,zi.orisum as orisumZi,zi.orimoney as orimoneyZi,zi.natsum as natsumZi,zi.natmoney as natmoneyZi from AT18EBC24C08E00004.AT18EBC24C08E00004.use_details left join AT18EBC24C08E00004.AT18EBC24C08E00004.matterbill zi on zi.use_details_id = id where vouchdate leftlike '" +
      dataNow +
      "'";
    var resBiaotou = ObjectStore.queryByYonQL(sqlBiaotou);
    let kjztId = "";
    var sqlKjzt = "select id,name,code from org.func.BaseOrg where name='高尓夫尊（北京）科技有限公司'";
    var resKjzt = ObjectStore.queryByYonQL(sqlKjzt, "ucf-org-center");
    if (resKjzt.length > 0) {
      kjztId = resKjzt[0].id;
    } else {
      throw new Error("获取会计主体Id失败，请检查基础数据！！！");
    }
    let jiaoyiType = "arap_oar_other";
    let bzId = "";
    var sqlbz = "select id,name,code from bd.currencytenant.CurrencyTenantVO where name='人民币'";
    var resbz = ObjectStore.queryByYonQL(sqlbz, "ucfbasedoc");
    if (resbz.length > 0) {
      bzId = resbz[0].id;
    } else {
      throw new Error("获取人民币币种Id失败，请检查基础数据！！！");
    }
    let hl = "1";
    let hlType = "";
    var sqlhlType = "select id,name,code from bd.exchangeRate.ExchangeRateTypeVO where name='基准汇率'";
    var reshlType = ObjectStore.queryByYonQL(sqlhlType, "ucfbasedoc");
    if (reshlType.length > 0) {
      hlType = reshlType[0].id;
    } else {
      throw new Error("获取汇率类型Id失败，请检查基础数据！！！");
    }
    let kehuListStr = "";
    for (var a = 0; a < resBiaotou.length; a++) {
      if (!includes(kehuListStr, trim(resBiaotou[a].customer_code))) {
        kehuListStr = kehuListStr + trim(resBiaotou[a].customer_code) + ",";
      }
    }
    var kehuList = split(substring(kehuListStr, 0, kehuListStr.length - 1), ",", 0);
    kehuList = JSON.parse(kehuList);
    let bodyList = "";
    for (var b = 0; b < kehuList.length; b++) {
      let shuilv = 0;
      let hanshuiAmount = 0;
      let wushuiAmount = 0;
      let hanshuiAmountRmb = 0;
      let wushuiAmountRmb = 0;
      for (var c = 0; c < resBiaotou.length; c++) {
        if (trim(resBiaotou[c].customer_code) == kehuList[b]) {
          shuilv = resBiaotou[c].taxrateZi;
          hanshuiAmount = hanshuiAmount * 1 + resBiaotou[c].orisumZi * 1;
          wushuiAmount = wushuiAmount * 1 + resBiaotou[c].orimoneyZi * 1;
          hanshuiAmountRmb = hanshuiAmountRmb * 1 + resBiaotou[c].natsumZi * 1;
          wushuiAmountRmb = wushuiAmountRmb * 1 + resBiaotou[c].natmoneyZi * 1;
        }
      }
      var uuidYingshou = uuid();
      let body = {
        resubmitCheckKey: replace(uuidYingshou, "-", ""), //保证请求的幂等性,该值由客户端生成,并且必须是全局唯一的，长度不能超过32位。更多信息,请参见«MDD幂等性»
        accentity_code: kjztId, //会计主体（支持id和code）示例：2672016821114370
        vouchdate: dateResult.dateView.substring(0, 10), //单据日期,格式为:yyyy-MM-dd
        tradetype_code: jiaoyiType, //交易类型（支持id和code）示例：arap_oar_other
        currency_name: bzId, //币种（支持id、code、name）示例：CNY
        customer_code: "", //客户（支持id和code）示例：7779999
        exchRate: hl, //汇率
        exchangeRateType_code: hlType, //汇率类型编码（支持id和code）
        oriSum: hanshuiAmount, //金额，等于明细行含税金额合计值
        natSum: hanshuiAmountRmb, //本币金额，等于明细行本币含税金额合计值
        _status: "Insert", //操作标识, Insert:新增、Update:更新
        oarDetail: [
          {
            taxRate: shuilv, //税率(%)示例：当税率是13%时，接口传值13
            oriSum: hanshuiAmount, //含税金额
            oriMoney: wushuiAmount, //无税金额
            natMoney: wushuiAmountRmb, //本币无税金额
            natSum: hanshuiAmountRmb, //本币含税金额
            _status: "Insert" //操作标识, Insert:新增、Update:更新、Unchanged:不变
          }
        ]
      };
      bodyList = bodyList + JSON.stringify(body) + ",";
    }
    let body = {
      data: JSON.parse("[" + bodyList.substring(0, bodyList.length - 1) + "]")
    };
    let url = "https://www.example.com/";
    var apiResponse = openLinker("POST", url, "AT18EBC24C08E00004", JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code != "200") {
      throw new Error("=============通用报销单保存异常，请联系管理员==========" + apiResponse.message + "===========入参：" + JSON.stringify(body));
    }
  }
}
exports({ entryPoint: MyTrigger });