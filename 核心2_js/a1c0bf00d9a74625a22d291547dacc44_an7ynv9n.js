let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var resultdiscount = 0; //优惠金额
    var resultcount = 0; //优惠数量
    var left = 0; //剩余优惠数量
    var onuse = 0; //已使用数量
    var object = "";
    var isExist = false;
    let productid = request.productid; //商品id
    let num = request.num; //订单数量
    let storeid = request.storeid; //新开门店id
    var currentDate = new Date(); // 获取当前日期时间
    var currentDateISO = currentDate.toISOString().slice(0, 10);
    //查询门店对应的规则id
    let profileidSql = "select businessprofile,pricing_policy from GT80750AT4.GT80750AT4.storeprofile where id = '" + storeid + "'";
    let profileidSqlRes = ObjectStore.queryByYonQL(profileidSql);
    let profileid = profileidSqlRes[0].businessprofile;
    let pricing_policy = profileidSqlRes[0].pricing_policy;
    let productBSql =
      "select discountamount,pricing_policy from GT80750AT4.GT80750AT4.specialoffer_b left join GT80750AT4.GT80750AT4.specialoffer a on specialoffer_id = a.id where product_id = '" +
      productid +
      "' and a.id = '" +
      profileid +
      "' and stopdate >= '" +
      currentDateISO +
      "' and a.begintime <= '" +
      currentDateISO +
      "'  and a.endtime >= '" +
      currentDateISO +
      "'";
    let profileSql =
      "select usenum, leftnum from GT80750AT4.GT80750AT4.storeprofile_b left join GT80750AT4.GT80750AT4.storeprofile a on storeprofile_id = a.id where product_name = '" +
      productid +
      "' and a.id = '" +
      storeid +
      "' and a.stopdate >= '" +
      currentDateISO +
      "'";
    var cidSql =
      "select id from GT80750AT4.GT80750AT4.storeprofile_b left join GT80750AT4.GT80750AT4.storeprofile a on a.id = storeprofile_id where a.id = '" +
      storeid +
      "' and product_name = '" +
      productid +
      "'";
    let productB = ObjectStore.queryByYonQL(productBSql);
    let profile = ObjectStore.queryByYonQL(profileSql);
    var resData = {
      result: []
    };
    if (productB == undefined || productB.length == 0) {
      resData.result.push(isExist);
      return { data: resData };
    }
    let pricing_policyRes = productB.filter((item) => item.pricing_policy === pricing_policy);
    if (pricing_policyRes == undefined) {
      return { data: resData };
    }
    productB[0] = pricing_policyRes[0];
    //判断当前行商品是否存在于特价商品档案 和 当前选择的新开门店中是否有商品
    if (productB !== undefined && productB.length !== 0 && profile !== undefined && profile.length !== 0) {
      //获取子表id
      var cid = ObjectStore.queryByYonQL(cidSql)[0].id;
      let profileleft = profile[0].leftnum;
      let profileuse = profile[0].usenum;
      resultdiscount = productB[0].discountamount;
      //判断订单数量 与 剩余优惠数量的关系
      if (num < profileleft) {
        //订单数量小于剩余优惠数量 取订单数量
        onuse = profileuse + num; //计算已使用数量
        left = profileleft - num; //计算剩余数量
        resultcount = num;
      } else {
        //订单数量小于剩余优惠数量 取剩余优惠数
        onuse = profileuse + profileleft; //计算已使用数量
        left = 0; //计算剩余数量
        resultcount = profileleft;
      }
      isExist = true;
      resData.result.push(isExist);
      resData.result.push(resultdiscount);
      resData.result.push(resultcount);
      resData.result.push(cid);
      resData.result.push(onuse);
      resData.result.push(left);
    }
    return { code: 200, message: "success", data: resData };
  }
}
exports({ entryPoint: MyAPIHandler });