let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var yzUrl = "https://www.example.com/";
    //新测试环境
    //生产环境
    var yourappkey = "yourkeyHere";
    var yourappsecrect = "7268c112fe2049b6a812fa59c26e6123";
    //本地
    var appId = "yourIdHere";
    var app = "yongyou-ys";
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    //营业日期
    var yesterday = getDay("-1", "-");
    var bussDate = replace(yesterday, "-", "");
    //获取所有的门店id
    var queryAllStore = "select storeID from GT31971AT37.GT31971AT37.StoreInfo where dr='0'";
    var allStore = ObjectStore.queryByYonQL(queryAllStore);
    var storeIDs = new Array();
    allStore.forEach((store, index) => {
      storeIDs.push(store.storeID);
    });
    storeIDs.forEach((storeID, index) => {
      var sign = MD5Encode(appId + bussDate + storeID);
      var body = {
        body: {
          storeId: storeID,
          bussDate: yesterday,
          sign: sign,
          displayTable: true,
          comPress: false,
          inTime: 30
        },
        header: {
          app: "yongyou-ys"
        }
      };
      console.log("请求入参: {}", JSON.stringify(body));
      var queryResponse = postman("post", yzUrl, JSON.stringify(header), JSON.stringify(body));
      var queryResponseJson = JSON.parse(queryResponse);
      console.log("返回信息: {}", JSON.stringify(queryResponseJson));
      var queryCode = queryResponseJson.header.code;
      if (queryCode == "10000") {
        //查询成功，拼接日结单数据
        let body = queryResponseJson.body;
        //拼接雅座数据
        let yzData = {
          bussDate: body.bussDate,
          storeId: body.storeId,
          storeName: body.storeName,
          bussBillAmount: body.bussBillAmount,
          yzSaleList: body.discountDetail,
          yzSaleRealList: body.payVOList,
          areaListList: body.saleAreaTableUnitData,
          periodListList: body.periodList,
          singleAndComboDisheList: body.singleAndComboDishesList,
          YzstoreVOListList: body.storeVOList
        };
        //一个门店一天只能有一条数据
        let queryDayDataExit = "select * from GT31971AT37.GT31971AT37.yzParent where storeId = '" + body.storeId + "' and bussDate = '" + body.bussDate + "' and dr='0'";
        let queryDayDataExitResponse = ObjectStore.queryByYonQL(queryDayDataExit);
        //查询到结果，当前日期日结单已经有了，不允许再插入
        if (queryDayDataExitResponse.length != 0) {
          return;
        }
        //将单个日结单放到集合中
        try {
          ObjectStore.insert("GT31971AT37.GT31971AT37.yzParent", yzData, "b9e7fa16");
        } catch (err) {
          console.error(err);
        }
      }
    });
    function getDay(num, str) {
      let today = new Date();
      let preDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      var oYear = preDate.getFullYear();
      var oMoth = (preDate.getMonth() + 1).toString();
      if (oMoth.length <= 1) oMoth = "0" + oMoth;
      var oDay = preDate.getDate().toString();
      if (oDay.length <= 1) oDay = "0" + oDay;
      return oYear + str + oMoth + str + oDay;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });