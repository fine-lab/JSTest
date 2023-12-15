let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let billnum = param.billnum;
    if (data) {
      var currentUser = JSON.parse(AppContext()).currentUser;
      let url = "https://www.example.com/";
      if (billnum === "voucher_delivery" || billnum === "voucher_deliverylist") {
        data.forEach((ship) => {
          var randIDID = uuid();
          if ((param.action === null || param.action === "audit") && ship.statusCode === "DELIVERING") {
            //审核
            var apiData = { userInfo: "", userId: currentUser.id, gmtBorn: new Date().getTime() + "", msgId: randIDID, type: "SALES_DELIVERY" };
            apiData.data = { id: ship.id + "", userId: currentUser.id };
            let postData = { message: apiData };
            let strResponse = openLinker("POST", url, "SCMSA", JSON.stringify(postData));
          } else if (param.action === "scrap" && ship.statusCode === "DELIVERING") {
            //弃审
            let apiData = { userInfo: "", userId: currentUser.id, gmtBorn: new Date().getTime() + "", msgId: randIDID, type: "SALES_DELIVERY_REVOKE" };
            apiData.data = { id: ship.id + "", userId: currentUser.id };
            let postData = { message: apiData };
            let strResponse = openLinker("POST", url, "SCMSA", JSON.stringify(postData));
            let resObj = JSON.parse(strResponse);
            if (resObj && resObj.returnData) {
              if (resObj.returnData.syncStatus === 2) {
                throw new Error(resObj.returnData.errMsg);
              }
              return {};
            } else {
            }
          }
        });
      } else if (billnum === "voucher_salereturn" || billnum === "voucher_salereturnlist") {
        data.forEach((item) => {
          var randIDID = uuid();
          if (item.saleReturnStatus === "SUBMITSALERETURN") {
            //确认
            var apiData = { userInfo: "", userId: currentUser.id, gmtBorn: new Date().getTime() + "", msgId: randIDID, type: "SALES_RETURN" };
            apiData.data = { id: item.code + "", userId: currentUser.id };
            let postData = { message: apiData };
            let strResponse = openLinker("POST", url, "SCMSA", JSON.stringify(postData));
          } else if (item.saleReturnStatus === "CONFIRMSALERETURNORDER") {
            //反确认
            var apiData = { userInfo: "", userId: currentUser.id, gmtBorn: new Date().getTime() + "", msgId: randIDID, type: "SALES_RETURN_REVOKE" };
            apiData.data = { id: item.code + "", userId: currentUser.id };
            let postData = { message: apiData };
            let strResponse = openLinker("POST", url, "SCMSA", JSON.stringify(postData));
            let resObj = JSON.parse(strResponse);
            if (resObj && resObj.returnData) {
              if (resObj.returnData.syncStatus === 2) {
                throw new Error(resObj.returnData.errMsg);
              }
              return {};
            } else {
            }
          }
        });
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });