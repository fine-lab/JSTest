let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Data = getOtherOutRecoeds([param.data[0].id]);
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let test = URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/transtype/detail";
    let uspaceReceiver = ["1a591623-4800-412a-ad38-d0572e7d583a"];
    let channelses = ["uspace"];
    let title = "材料出库错误预警！";
    let content = "单据编号为：" + Data[0].code + "，报错节点：" + "保存" + "，报错信息：" + JSON.stringify(Data);
    let messageInfos = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channelses,
      subject: title,
      content: content,
      groupCode: "prewarning"
    };
    let resulte = sendMessage(messageInfos);
    if (param.converBatchBills[0]._status == "Insert") {
      let param2 = { data: Data };
      let func = extrequire("ST.unit.MaterialOut");
      let OutData = func.execute(null, param2);
      let header = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(OutData.body));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        throw new Error("调用OMS材料出库创建API失败！" + str.errorMessage);
      }
    } else if (param.converBatchBills[0]._status == "Update") {
      let body = {
        appCode: "beiwei-oms",
        appApiCode: "ys.cancel.clck.order",
        schemeCode: "bw47",
        jsonBody: { outBizOrderCode: Data[0].code }
      };
      let header = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        if (str.errorCode != "A1000") {
          throw new Error("调用OMS材料出库取消API失败！" + str.errorMessage);
        }
      }
      let param2 = { data: Data };
      let func = extrequire("ST.unit.MaterialOut");
      let OutData = func.execute(null, param2);
      let DeleteRequest = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(OutData.body));
      let item = JSON.parse(DeleteRequest);
      if (item.success != true) {
        throw new Error("调用OMS材料出库创建API失败！" + item.errorMessage);
      }
    }
    function getOtherOutRecoeds(ids) {
      var object = {
        ids: ids,
        compositions: [
          {
            name: "materOuts"
          }
        ]
      };
      return ObjectStore.selectBatchIds("st.materialout.MaterialOut", object);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });