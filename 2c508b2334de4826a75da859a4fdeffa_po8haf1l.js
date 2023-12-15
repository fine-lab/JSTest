let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    console.log(JSON.stringify(request));
    request = request.data;
    //请求地址
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    //获取crmtoken
    let body = { code: "thirdToken" };
    var parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
    console.log(parambase);
    var param = JSON.parse(parambase);
    console.log(request);
    try {
      request = JSON.parse(request);
    } catch (e) {
    } finally {
    }
    //整单金额为0不推送订单
    if (request.fMoneySum == "0") {
      console.log(request.code + "兑换商品不推送");
      return {};
    }
    var orderList = [];
    //零售订单信息
    var retailvouch = request.rm_retailvouch;
    var coupNos = [];
    var coupInfo = [];
    var retailVouchDetails = {};
    if (request.rm_retailvouch != null) {
      retailVouchDetails = request.retailVouchDetails;
      request = request.rm_retailvouch[0];
    } else {
      coupInfo = request.retailvouchgifttoken;
      retailVouchDetails = request.retailVouchDetails;
    }
    if (coupInfo != undefined && coupInfo.length != 0) {
      coupInfo.map((item, index, arr) => {
        console.log(arr); // arrObj
        console.log(index); // 0 1 2
        console.log(item.name); // xiaohua xiaomin xiaobai
        coupNos.push(item.cGiftTokensn);
      });
    }
    var storeSql = "select codebianma from aa.store.Store where code = '" + request.cStoreCode + "'";
    var stores = ObjectStore.queryByYonQL(storeSql, "yxybase");
    //构建零售单参数
    //销售明细列表
    var dtls = [];
    var saleType = "";
    //销售明细
    retailVouchDetails.map((item, index, arr) => {
      console.log(arr); // arrObj
      console.log(index); // 0 1 2
      console.log(item.name); // xiaohua xiaomin xiaobai
      if (item.kitproduct == null) {
        //是否套组子商品
        if (request.billingStatus == "FormerBackBill") {
          saleType = "R";
        } else {
          saleType = "S";
        }
        var dtlInfo = {
          saleType: saleType,
          cmdSalerCode: "", //销售编码
          cmdShopCode: "", //门店编码
          coupNos: coupNos, //券
          dividePoint: 0, //积分
          prodCode: item.product_cCode, //产品编码/code
          prodNo: item.productsku_cCode, //产品系列号/sku
          refSaleNo: item.iCoRetailDetailId,
          saleDate: request.createTime, //创建时间
          saleDiscountMoney: item.fGiftTokenDiscount, //折扣金额
          saleMoney: item.fPrice, //销售金额
          saleNo: item.id, //子表订单编号
          saleOrigMoney: Number(item.fQuoteMoney), //原始金额
          salePayMoney: Number(item.fMoney), //实付金额
          saleProdQty: Number(item.fQuantity), //产品数量
          saleQty: Number(item.fmainUnitQuantity), //订单数量
          salerCode: "",
          shopCode: stores[0].codebianma,
          sn: [],
          vipOffCode: request.cMemberCode
        };
        dtls.push(dtlInfo);
      }
    });
    //通过crmID查询用户是否存在
    var resMembers = [];
    var crmID = "";
    if (request.cMemberCode != null) {
      var sqlMembers = "select crmID from uhybase.members.Members where cPhone ='" + request.cMemberCode + "'  limit 0,1";
      resMembers = ObjectStore.queryByYonQL(sqlMembers, "uhy");
      crmID = resMembers[0].crmID;
    }
    var oederInfo = {
      saleType: saleType,
      cmdSalerCode: "",
      cmdShopCode: "",
      coupNos: coupNos,
      dataOrigin: 0,
      dtls: dtls,
      id: 0,
      membershipSystemId: 1,
      orderStatus: 8,
      partnerId: 1,
      point: 0,
      postage: 0,
      refSaleNo: request.CoCode,
      saleDate: request.createTime,
      saleDiscountMoney: 0,
      saleMoney: Number(request.fMoneySum),
      saleNo: request.code,
      saleOrigMoney: Number(request.fQuoteMoneySum),
      salePayMoney: Number(request.fMoneySum),
      saleProdQty: Number(request.fQuantitySum),
      saleQty: Number(request.fQuantitySum),
      salerCode: "0",
      shopCode: stores[0].codebianma,
      vipOffCode: crmID
    };
    orderList.push(oederInfo);
    console.log("推送参数:" + JSON.stringify(oederInfo));
    let func1 = extrequire("SDMB.base.getToken");
    let restoken = func1.execute();
    var token = restoken.access_token;
    let posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
    let res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/sendOrderPos?access_token=" + token, JSON.stringify(posheader), JSON.stringify(orderList));
    if (res == null) {
      //返回结果为null,更新token重新调用
      console.log("返回结果为null,更新token重新调用======>");
      let func2 = extrequire("SDMB.base.getCrmToken2");
      let eceres = func2.execute();
      console.log("重新获取token返回数据" + JSON.stringify(eceres));
      body = { code: "thirdToken" };
      parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
      param = JSON.parse(parambase);
      posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
      let apiResponse = openLinker("post", buzUrl + "/po8haf1l/crmApi/coupon/yonbip/sd/coupon/save/v1", "SDMB", JSON.stringify(body));
    }
    console.log(res);
    res = JSON.parse(res);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });