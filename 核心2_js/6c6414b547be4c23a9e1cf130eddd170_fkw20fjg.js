let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    throw new Error(123);
    //获取会员ID，会员等级，实收金额
    var levelId = param.data[0].levelId;
    var mid = param.data[0].iMemberid;
    var money = param.data[0].fMoneySum;
    var dDate = param.data[0].dDate;
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
      token: token
    };
    //调用API函数，进行钱包充值
    //调用API函数接口
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
    };
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(request));
    var obj = JSON.parse(apiResponse);
    var data = obj.data;
    //解析返回结果
    var rechargeResponse = JSON.parse(data.rechargeResponse);
    if (rechargeResponse.code != 200) {
      throw new Error("返现充值失败" + JSON.stringify(rechargeResponse));
    }
    //记录返现金额字段
    var backMoney = data.backMoney;
    param.data[0].set("memo", backMoney);
    return { message: "返现成功" };
  }
}
exports({ entryPoint: MyTrigger });