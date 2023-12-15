let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let billnum = param.billnum;
    if (data) {
      var currentUser = JSON.parse(AppContext()).currentUser;
      let url = "https://www.example.com/";
      data.forEach((ship) => {
        var randIDID = uuid();
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
      });
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });