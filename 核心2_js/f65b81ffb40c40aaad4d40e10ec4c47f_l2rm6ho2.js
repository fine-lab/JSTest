let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let appKey = "yourKeyHere"; //分配的appKey(正式环境修改)
    let secretKey = "yourKeyHere"; //开发者密钥(正式环境修改)
    let version = "2.0"; //版本
    let timestamp = new Date().getTime(); //时间戳
    let daySart = 1499147465983; //new Date(new Date().toLocaleDateString()).getTime();//每一天开始时间
    let dayEnd = 1599147465983; //new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;//每一天结束时间
    let token_url = "https://www.example.com/"; // 获取token的url(正式环境修改)
    let hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let url = "https://www.example.com/"; //订单列表接口(正式环境修改);
    let detailurl = "https://www.example.com/"; //订单详情接口(正式环境修改);
    let billnum = "ad6ff7a2"; //单据编码
    let entiteurl = "GT27751AT435.GT27751AT435.OpenOrderExport"; //实体URL
    let shopids = getAllShopID("GT27751AT435.GT27751AT435.OpenShopInfo");
    let resres = null;
    if (null !== shopids.rst && shopids.rst.length > 0) {
      for (var i = shopids.rst.length - 1; i >= 0; i--) {
        let shopIdenty = shopids.rst[i].commercialID; //门店ID
        let reparam = {
          appKey: appKey,
          secretKey: secretKey,
          shopIdenty: shopIdenty,
          version: version,
          timestamp: timestamp,
          token_url: token_url
        };
        let func1 = extrequire("GT27751AT435.backDefaultGroup.getkrytoken"); //获取token函数
        let res = func1.execute(reparam);
        let token = res.access_token;
        if (undefined !== token) {
          let pageNumber = 1;
          let responcount = getListData(appKey, timestamp, shopIdenty, daySart, dayEnd, pageNumber, version, token);
          let totalsize = responcount.responsedata.result.totalRows;
          let maxrows = responcount.responsedata.result.pageSize;
          let tradeNos = [];
          if (Number(totalsize) > Number(maxrows)) {
            let pageSum = Number(totalsize) % Number(maxrows) === 0 ? Number(totalsize) / Number(maxrows) : Number(totalsize) / Number(maxrows) + 1;
            for (var pagenum = 1; pagenum <= 1; pagenum++) {
              let inserdata = getListData(appKey, timestamp, shopIdenty, daySart, dayEnd, pagenum, version, token);
              resres = ObjectStore.insertBatch(entiteurl, inserdata.responsedata.result.items, billnum);
              let tradeNos1 = getOrderNo(inserdata.responsedata.result.items);
              tradeNos = tradeNos.concat(tradeNos1);
            }
          } else {
            let responsedata = getListData(appKey, timestamp, shopIdenty, daySart, dayEnd, pageNumber, version, token);
            resres = ObjectStore.insertBatch(entiteurl, responsedata.responsedata.result.items, billnum);
            tradeNos = getOrderNo(responsedata.responsedata.result.items);
          }
          let inserdetaildata = getDetailData(appKey, timestamp, shopIdenty, tradeNos, token);
        }
      }
    }
    return { resres };
    function getAllShopID(shopentityurl) {
      let sql = "select   commercialID,commercialName  from  " + shopentityurl + "  where dr=0";
      let rst = ObjectStore.queryByYonQL(sql);
      return { rst };
    }
    function getDetailData(appKey, timestamp, shopIdenty, tradeNos, token) {
      let body = JSON.stringify({ shopIdenty: shopIdenty, ids: tradeNos });
      let secrectdata = "appKey" + appKey + "shopIdenty" + shopIdenty + "timestamp" + timestamp + "version" + version + "body" + body + token;
      let resdata = SHA256Encode(secrectdata);
      let signature = encodeURIComponent(resdata);
      let base_path = detailurl + "?appKey=" + appKey + "&shopIdenty=" + shopIdenty + "&timestamp=" + timestamp + "&version=" + version + "&sign=" + signature;
      let strResponse = postman("post", base_path, JSON.stringify(header), body);
      let responsedata = JSON.parse(strResponse);
      return { responsedata };
    }
    function getListData(appKey, timestamp, shopIdenty, daySart, dayEnd, pageNumber, version, token) {
      let body = JSON.stringify({ shopIdenty: shopIdenty, startTime: daySart, endTime: dayEnd, pageNo: Number(pageNumber), timeType: 2, pageSize: 10 });
      let secrectdata = "appKey" + appKey + "shopIdenty" + shopIdenty + "timestamp" + timestamp + "version" + version + "body" + body + token;
      let resdata = SHA256Encode(secrectdata);
      let signature = encodeURIComponent(resdata);
      let base_path = url + "?appKey=" + appKey + "&shopIdenty=" + shopIdenty + "&timestamp=" + timestamp + "&version=" + version + "&sign=" + signature;
      let strResponse = postman("post", base_path, JSON.stringify(header), body);
      let responsedata = JSON.parse(strResponse);
      return { responsedata };
    }
    function getOrderNo(items) {
      let tradeNos = [];
      for (var i = 0; i < items.length; i++) {
        tradeNos.push(items[i].orderId);
      }
      return tradeNos;
    }
  }
}
exports({ entryPoint: MyAPIHandler });