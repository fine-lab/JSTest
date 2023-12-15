let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前日期
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month > 9 ? month : "0" + month;
    day = day > 9 ? day : "0" + day;
    var vouchdate = date.getFullYear() + "-" + month + "-" + day;
    let AppCode = "ST";
    //产品入库详情查询URL
    let storeprorecordDetailUrl = "https://www.example.com/";
    //产品入库详情查询
    let storeprorecordDetailResponse = JSON.parse(openLinker("GET", storeprorecordDetailUrl + "?id=" + request.id, AppCode, null));
    var data_v1;
    if (storeprorecordDetailResponse.code == 200) {
      data_v1 = storeprorecordDetailResponse.data; //storeProRecords 产品入库单子表
    } else {
      return {};
    }
    var sql = `select id,*,waste_product_code from AT17AA2EFA09C00009.AT17AA2EFA09C00009.coilRegistrationDetails where manufacturing_order_id == ${data_v1.srcBill}`;
    var queryDate = ObjectStore.queryByYonQL(sql, "developplatform");
    //形态转换单新增
    var morphologyconversionResponse;
    //形态转换单Body
    var morphologyconversionData;
    //形态转换单子表详情列表
    var morphologyconversiondetailList = new Array();
    //形态转换单新增Body
    var morphologyconversionParam = {
      org: data_v1.org, //库存组织ID或者code
      businesstypeId: "yourIdHere", //业务类型Id或者code 拆卸
      conversionType: "1", //转换类型，1表示1对1转换，2表示多对1转换，3表示一对多转换
      mcType: "1", //转换纬度，1表示物料转换，2表示序列号转换，3表示组转，4表示拆卸
      vouchdate: vouchdate, //单据日期
      _status: "Insert",
      morphologyconversiondetail: "",
      headItem: {
        define1: data_v1.id
      }
    };
    //生产制造单详情
    var n = 1; //组号
    for (var i = data_v1.storeProRecords.length - 1; i >= 0; i--) {
      //形态转换单子表详情
      var morphologyconversiondetail = {
        groupNumber: n, //组号
        lineType: "1", //类别 1表示转换前，2表示转换后，3表示套件，4表示散件
        warehouse: data_v1.warehouse, //仓库
        productsku: data_v1.storeProRecords[i].productsku,
        product: data_v1.storeProRecords[i].product, //物料编码或id
        mainUnitId: data_v1.storeProRecords[i].stockUnitId, //主计量id,或者code
        stockUnitId: data_v1.storeProRecords[i].stockUnitId, //库存单位id或者编码
        invExchRate: data_v1.storeProRecords[i].invExchRate, //换算率
        qty: data_v1.storeProRecords[i].qty, //数量
        subQty: data_v1.storeProRecords[i].qty, //件数
        source: "st_storeprorecord",
        sourceid: data_v1.id,
        upcode: data_v1.code,
        sourceautoid: data_v1.storeProRecords[i].id
      };
      morphologyconversiondetailList.push(morphologyconversiondetail);
      for (var j = 0; queryDate.length > j; j++) {
        if (queryDate[j].id == data_v1.storeProRecords[i].sourceautoid) {
          var productDetailUrl = "https://www.example.com/";
          var productDetBody = {
            id: queryDate[j].waste_product,
            orgId: "yourIdHere"
          };
          var productDetailApiResponse = JSON.parse(openLinker("POST", productDetailUrl, AppCode, JSON.stringify(productDetBody)));
          morphologyconversiondetail = {
            groupNumber: n, //组号
            lineType: "2", //类别 1表示转换前，2表示转换后，3表示套件，4表示散件
            warehouse: data_v1.warehouse, //仓库
            product: queryDate[j].waste_product, //物料编码或id
            productsku: productDetailApiResponse.data.defaultSKUId,
            mainUnitId: productDetailApiResponse.data.unit, //主计量id,或者code
            stockUnitId: productDetailApiResponse.data.unit, //库存单位id或者编码
            invExchRate: 1, //换算率
            qty: queryDate[j].weigth, //数量
            subQty: queryDate[j].weigth, //件数
            source: "st_storeprorecord",
            sourceid: data_v1.id,
            upcode: data_v1.code,
            sourceautoid: data_v1.storeProRecords[i].id
          };
          morphologyconversiondetailList.push(morphologyconversiondetail);
        }
      }
      n++;
    }
    if (morphologyconversiondetailList.length == 0) {
      return {};
    }
    morphologyconversionParam.morphologyconversiondetail = morphologyconversiondetailList;
    morphologyconversionData = {
      data: morphologyconversionParam
    };
    //形态转换单新增
    let morphologyconversionUrl = "https://www.example.com/";
    morphologyconversionResponse = openLinker("Post", morphologyconversionUrl, AppCode, JSON.stringify(morphologyconversionData));
    return {
      morphologyconversionResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});