let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    console.log("request:" + JSON.stringify(request));
    var sql = "select id from uhybase.coupon.Coupon where couponSN ='" + request.data.couponSN + "'  limit 0,1";
    var res = ObjectStore.queryByYonQL(sql, "uhy");
    if (request.data.iScopeType == "3") {
      request.data.iScopeType = "4";
    }
    if (res.length < 1) {
      //不存在新增
      request.data._status = "Insert";
      request.data.iElecCard = "false";
      request.data.iMemberBind = "1";
      request._status = "Insert";
    } else {
      //存在修改
      request.data._status = "Update";
      request._status = "Update";
      request.data.id = res[0].id;
    }
    if (request.data.couponGoods != null) {
      var couponGoods = [];
      let goodsBody = {
        fields: ["productId", "productName", "code", "name", "id"],
        codeList: request.data.couponGoods
      };
      var goodStr = "";
      let goodsInfo = openLinker("post", buzUrl + "/yonbip/digitalModel/product/sku/getSkuInfoByPage", "SDMB", JSON.stringify(goodsBody));
      console.log("sku数据:" + goodsInfo);
      goodsInfo = JSON.parse(goodsInfo);
      goodsInfo.data.recordList.map((item, index, arr) => {
        goodStr = goodStr + item.iGoodsID;
      });
      //判断是否需要修改适用商品
      if (goodsInfo.data.recordCount > 0) {
        //查询已经关联的商品信息
        if (res.length > 0) {
          var couponGoodSql = "select * from 	uhybase.coupon.CouponGoodsSKU where iCouponID ='" + res[0].id + "'";
          var couponGood = ObjectStore.queryByYonQL(couponGoodSql, "uhy");
          console.log(couponGood);
          couponGood.map((item, index, arr) => {
            console.log(arr); // arrObj
            console.log(index); // 0 1 2
            console.log(item.name); // xiaohua xiaomin xiaobai
            var good = {
              iGoodsSKUID: item.iGoodsSKUID,
              iGoodsID: item.iGoodsID,
              iCouponID: item.iCouponID,
              cGoodsSKUName: item.cGoodsSKUName,
              id: item.id,
              _status: "Delete",
              ytenant: ObjectStore.env().tenantId,
              yTenantId: ObjectStore.env().tenantId,
              iDependOn: 4
            };
            couponGoods.push(good);
          });
        }
        //需要关联的商品信息
        goodsInfo.data.recordList.map((item, index, arr) => {
          var good = {
            iGoodsSKUID: item.id,
            iGoodsID: item.productId,
            cGoodsSKUName: item.name,
            _status: "Insert",
            iDependOn: 4
          };
          couponGoods.push(good);
        });
      }
      request.data.couponGoodsSKU = couponGoods;
    }
    var cStoreIDs = "";
    if (request.data.storeCodes != null) {
      var couponStore = [];
      if (request.data.storeCodes != "") {
        //需要新增的门店
        var storeSql = "select * from 	aa.store.Store where codebianma in(" + request.data.storeCodes + ")";
        var stores = ObjectStore.queryByYonQL(storeSql, "yxybase");
        var delectStr = "";
        if (res.length > 0) {
          //需要删除的门店
          var couponStoresSql = "select * from 	uhybase.coupon.CouponStore where iDocID ='" + res[0].id + "'";
          var couponStores = ObjectStore.queryByYonQL(couponStoresSql, "uhy");
          couponStores.map((item, index, arr) => {
            delectStr = delectStr + item.iStoreID;
          });
          stores.map((item, index, arr) => {});
          //门店删除参数
          couponStores.map((item, index, arr) => {
            console.log("门店列表:" + JSON.stringify(item));
            if (cStoreIDs.indexOf(item.iStoreID) == -1) {
              var store = {
                iStoreID: item.iStoreID,
                cStoreCode: item.cStoreCode,
                cStoreName: item.cStoreName,
                iScopeType: 10,
                cAppID: item.cAppID,
                id: item.id,
                iDocID: item.iDocID,
                ytenant: ObjectStore.env().tenantId,
                yTenantId: ObjectStore.env().tenantId,
                _status: "Delete"
              };
              couponStore.push(store);
            }
          });
        }
        //门店新增参数
        stores.map((item, index, arr) => {
          if (delectStr.indexOf(item.id) == -1) {
            console.log("门店列表:" + JSON.stringify(item));
            if (index == 0) {
              cStoreIDs = item.id;
            } else {
              cStoreIDs = cStoreIDs + "," + item.id;
            }
            var store = {
              iStoreID: item.id,
              cStoreCode: item.code,
              cStoreName: item.name,
              _status: "Insert",
              iScopeType: 10
            };
            couponStore.push(store);
          }
        });
      } else {
        var storeSql = "select * from 	aa.store.Store where codebianma in(" + request.data.storeCodes + ")";
        var stores = ObjectStore.queryByYonQL(storeSql, "yxybase");
        var delectStr = "";
        if (res.length > 0) {
          //需要删除的门店
          var couponStoresSql = "select * from 	uhybase.coupon.CouponStore where iDocID ='" + res[0].id + "'";
          var couponStores = ObjectStore.queryByYonQL(couponStoresSql, "uhy");
          couponStores.map((item, index, arr) => {
            delectStr = delectStr + item.iStoreID;
          });
          stores.map((item, index, arr) => {});
          //门店删除参数
          couponStores.map((item, index, arr) => {
            console.log("门店列表:" + JSON.stringify(item));
            var store = {
              iStoreID: item.iStoreID,
              cStoreCode: item.cStoreCode,
              cStoreName: item.cStoreName,
              iScopeType: 10,
              cAppID: item.cAppID,
              id: item.id,
              iDocID: item.iDocID,
              ytenant: ObjectStore.env().tenantId,
              yTenantId: ObjectStore.env().tenantId,
              _status: "Delete"
            };
            couponStore.push(store);
          });
        }
      }
    }
    request.data.cStoreIDs = cStoreIDs;
    request.data.couponStore = couponStore;
    let body = request;
    let header = {};
    console.log(JSON.stringify(body));
    let apiResponse = openLinker("post", buzUrl + "/po8haf1l/crmApi/coupon/yonbip/sd/coupon/save/v1", "SDMB", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });