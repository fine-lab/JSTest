let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //库存查询根据物料编码查询
    //获取租户所在数据中心域名
    let hqym = "https://www.example.com/";
    let apiResponse = openLinker("GET", hqym, "GT6363AT15", JSON.stringify({}));
    let result = JSON.parse(apiResponse);
    //调用接口
    let url = result.data.gatewayUrl + "/yonbip/scm/stockanalysis/list";
    //获取前端函数数据
    let data1 = request.data;
    let id;
    let aa;
    let aaa;
    let diz = [];
    let productcode = [];
    //循环物料编码
    for (let j = 0; j < data1.length; j++) {
      let value = data1[j];
      aaa = {
        pageSize: 10,
        pageIndex: 1,
        product_cCode: value.product_code,
        warehouse_code: [16]
      };
      let resultdata = JSON.stringify(aaa);
      let apiResponse2 = openLinker("POST", url, "GT6363AT15", resultdata); //TODO：注意填写应用编码
      let responseObj1 = JSON.parse(apiResponse2);
      if (responseObj1.data.recordList.length != 0) {
        aa = responseObj1.data.recordList[0].currentqty;
      } else {
        aa = 0;
      }
      id = value.id;
      if (aa >= value.ziduan2) {
        //更新实体
        var object = { id: id, jylxid: "youridHere", jylxmc: "有库存销售", warehouse: "2583057891645952", _status: "Update" };
        var res = ObjectStore.updateById("GT6363AT15.GT6363AT15.XS001", object, "yb2a4ceb8d");
      } else {
        //更新实体
        var object = { id: id, jylxid: "youridHere", jylxmc: "无库存销售", warehouse: "2599911619106816", _status: "Update" };
        var res = ObjectStore.updateById("GT6363AT15.GT6363AT15.XS001", object, "yb2a4ceb8d");
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });