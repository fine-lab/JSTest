let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //临时判断只有测试门店才可以返现
    if (param.data[0].store_name != "测试门店") {
      return { message: "1" };
    }
    //判断只有现销才返现
    if (param.data[0].iBusinesstypeid_name != "现销") {
      return { message: "非现销不进行返现" };
    }
    //获取会员ID，会员等级，实收金额
    var levelId = param.data[0].levelId;
    var mid = param.data[0].iMemberid;
    var money = 0;
    var dDate = param.data[0].dDate;
    var code = param.data[0].code;
    //判断实际付的现金。要去掉找零，因为找零的金额是负数，所以直接加
    var retail = param.data[0].retailVouchGatherings;
    for (var i = 0; i < retail.length; i++) {
      if (retail[i].Paymentname == "现金" || retail[i].Paymentname == "找零" || retail[i].Paymentname == "POS转账" || retail[i].Paymentname == "对公转账" || retail[i].Paymentname == "POS收款") {
        money += retail[i].fMoney;
      }
    }
    //如果没有付现金则返回
    if (money === 0) {
      return {};
    }
    //判断如果没有会员，则返回
    if (!levelId || !mid || !money) {
      return {};
    }
    //获取token
    let tokenFun = extrequire("RM.backDefaultGroup.getTokenAccess");
    let tokenRes = tokenFun.execute();
    var token = tokenRes.access_token;
    var request = {
      levelId: levelId,
      mid: mid,
      money: money,
      date: new Date(),
      token: token,
      code: code
    };
    //调用API函数接口
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
    };
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(request));
    var obj = JSON.parse(apiResponse);
    var data = obj.data;
    //解析返回结果
    if (!data || !data.rechargeResponse) {
      throw new Error("返现充值失败1" + JSON.stringify(apiResponse));
    }
    var rechargeResponse = JSON.parse(data.rechargeResponse);
    if (rechargeResponse.code != 200) {
      throw new Error("返现充值失败" + JSON.stringify(rechargeResponse));
    }
    //记录返现金额字段，如果返现金额没有，则不记录
    var backMoney = data.backMoney;
    if (backMoney) {
      param.data[0].set("memo", backMoney);
    }
    return { message: "返现成功" };
  }
}
exports({ entryPoint: MyTrigger });