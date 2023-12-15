let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var tenantIds = context.tenant;
    let param1 = { tenantId: tenantIds };
    let getYmUrl = extrequire("AT17604A341D580008.hd03.getUrl");
    let ymUrl = getYmUrl.execute(param1);
    var gatewayUrl = ymUrl.domainName.gatewayUrl;
    var allData = param.data;
    if (allData.length != 0) {
      var value = allData[0];
    }
    var selzt = param.requestData;
    var newSelzt = JSON.parse(selzt);
    var newStatus = newSelzt._status;
    if (newStatus === "Insert") {
      //数据库编码
      var code = "AT17604A341D580008.AT17604A341D580008.PhaseCostFlow";
      let url = gatewayUrl + "/yonbip/AMP/api/v1/busievent/" + code; //https://dbox.diwork.com/iuap-api-gateway
      //处理数据调用一次正向接入生成入库调整
      var arrayList = value.PhaseCostFlow_subList;
      unique(arrayList);
      let apiResponse = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(value));
      var jsonALL = JSON.parse(apiResponse);
      if (jsonALL.code === "200") {
        var voucherid = jsonALL.eventInfo.srcBusiId;
        var BillVersion = jsonALL.eventInfo.srcBillVersion;
        BillVersion = BillVersion + "";
        var object = { id: voucherid, srcBillVersion: BillVersion }; //,isVoucher:"1"
        var res = ObjectStore.updateById("AT17604A341D580008.AT17604A341D580008.PhaseCostFlow", object, "PhaseCostFlows");
      } else {
        throw new Error("  -- 生成入库调整失败 -- ");
      }
    }
    function unique(arr) {
      // 第一层for循环控制第一个数
      for (let i1 = 0; i1 < arr.length; i1++) {
        // 第二层循环控制第二个数
        for (let j1 = i1 + 1; j1 < arr.length; j1++) {
          // 判断前后是否相等
          if (arr[i1].chengben === "4" && arr[j1].chengben === "4" && arr[i1].picihao === arr[j1].picihao) {
            if (arr[i1].zhuzhileixing === "6" && arr[j1].zhuzhileixing === "7") {
              var daitanzonges = arr[i1].daitanzonge + arr[j1].daitanzonge;
              daitanzonges = Number(daitanzonges.toFixed(2));
              arr[j1].daitanzonge = daitanzonges;
              arr[i1].daitanzonge = 0;
            } else if (arr[i1].zhuzhileixing === "7" && arr[j1].zhuzhileixing === "6") {
              var daitanzonges = arr[i1].daitanzonge + arr[j1].daitanzonge;
              daitanzonge = Number(daitanzonges.toFixed(2));
              arr[i1].daitanzonge = daitanzonges;
              arr[j1].daitanzonge = 0;
            }
          }
        }
      }
      // 循环删除精液成本的数据(种公猪,后备公猪)
      for (let c = 0; c < arr.length; c++) {
        if (arr[c].zhuzhileixing === "1" || arr[c].zhuzhileixing === "3") {
          arr.splice(c, 1);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });