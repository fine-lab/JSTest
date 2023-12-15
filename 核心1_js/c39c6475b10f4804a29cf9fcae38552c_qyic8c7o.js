let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pbids = request.pbids;
    let reqBudgetMny = 0;
    let ids = [];
    let hids = [];
    let bids = [];
    for (let i1 = 0; i1 < pbids.length; i1++) {
      if (!ids.includes(pbids[i1])) {
        let reqUrl = "https://www.example.com/" + pbids[i1];
        let reqRes = openLinker("GET", reqUrl, "ycContractManagement", JSON.stringify({}));
        let purchaseNum = JSON.parse(reqRes).data.purchaseNum;
        let planPrice = JSON.parse(reqRes).data.planPrice;
        reqBudgetMny += purchaseNum * planPrice;
      }
    }
    return { reqBudgetMny };
  }
}
exports({ entryPoint: MyAPIHandler });