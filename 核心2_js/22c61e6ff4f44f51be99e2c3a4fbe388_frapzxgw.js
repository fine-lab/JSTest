let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var AppCode = "AT18997BD609080003";
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? 0 + (datetime.getMonth() + 1).toString() : datetime.getMonth() + 1;
    var date = parseInt(datetime.getDate()) < 10 ? 0 + datetime.getDate().toString() : datetime.getDate();
    var productV1ListUrl = "https://www.example.com/";
    var productV1ListBody = {
      pageIndex: 1,
      pageSize: 10,
      code: "70000124"
    };
    var workcenterListUrl = "https://www.example.com/";
    var workcenterListBody = {
      pageIndex: 1,
      pageSize: 100,
      orgId: "yourIdHere",
      stopstatus: false,
      calculatePower: false,
      isOutsource: false
    };
    var workcenterListApiResponse = JSON.parse(openLinker("POST", workcenterListUrl, AppCode, JSON.stringify(workcenterListBody)));
    //标准物料清单列表查询URL
    var productDateUrl = "https://www.example.com/";
    //标准物料清单列表查询Body
    var productDateBody = {
      pageIndex: 1,
      pageSize: 10,
      orgId: "yourIdHere",
      productId: request.dataBody.id,
      isSum: true
    };
    var bomId;
    var gauge;
    //获取bomId Model versionCode
    var productDateApiResponse = JSON.parse(openLinker("POST", productDateUrl, AppCode, JSON.stringify(productDateBody)));
    if (productDateApiResponse.data.recordCount > 0) {
      gauge = {
        model: productDateApiResponse.data.recordList[0].model == undefined ? "0" : productDateApiResponse.data.recordList[0].model,
        versionCode: productDateApiResponse.data.recordList[0].versionCode == undefined ? "1.00" : productDateApiResponse.data.recordList[0].versionCode
      };
      bomId = productDateApiResponse.data.recordList[0].id;
    }
    //采购订单列表查询URL
    var purchaseorderListURL = "https://www.example.com/";
    //母件结构查询Url
    var BomListUrl = "https://www.example.com/";
    //母件结构查询Body
    var BomListBody = {
      orgId: "yourIdHere",
      bomId: bomId,
      extendParam: 1,
      expandWay: 1,
      expiryDate: year + "-" + month + "-" + date,
      showEffectiveChild: "0"
    };
    //工艺路线列表查询Url
    var RoutingListUrl = "https://www.example.com/";
    //工艺路线列表查询Body
    var RoutingListBody = {
      pageIndex: 1,
      pageSize: 30,
      orgId: "yourIdHere",
      code: request.dataBody.code
    };
    //获取BOM树
    let BomListapiResponse = JSON.parse(openLinker("POST", BomListUrl, AppCode, JSON.stringify(BomListBody)));
    //获取产品工艺路线
    let RoutingListApiResponse = JSON.parse(openLinker("POST", RoutingListUrl, AppCode, JSON.stringify(RoutingListBody)));
    var routingRecordList;
    var RoutingArray = new Array();
    routingRecordList = RoutingListApiResponse.data.recordList;
    if (RoutingListApiResponse.data.recordCount != 0) {
      for (var a = 0; a < RoutingListApiResponse.data.recordCount; a++) {
        var LaborCost;
        var OtherCost;
        var IndirectCosts;
        for (var p = 0; p < workcenterListApiResponse.data.recordList.length; p++) {
          if (routingRecordList[a].routingOperation_workCenterId == workcenterListApiResponse.data.recordList[p].id) {
            LaborCost = parseFloat(workcenterListApiResponse.data.recordList[p].mainAtt.define1);
            OtherCost = parseFloat(workcenterListApiResponse.data.recordList[p].mainAtt.define2);
            IndirectCosts = parseFloat(workcenterListApiResponse.data.recordList[p].mainAtt.define3);
          }
        }
        var pushRouting = {
          index: "1",
          MaterialCode_Name: routingRecordList[a].productId,
          MaterialCode: routingRecordList[a].productCode,
          MaterialCode_Name_name: routingRecordList[a].productName,
          WorkCenter: routingRecordList[a].routingOperation_workCenterIdName,
          PreparationTime: Math.round(parseFloat(routingRecordList[a].routingOperation_prepareTime) * 10000) / 10000,
          ProcessingTime: Math.round(parseFloat(routingRecordList[a].routingOperation_processTime) * 10000) / 10000,
          Description: replace(routingRecordList[a].detail_define3 + "\n" + routingRecordList[a].detail_define1, "||", ""),
          LaborCost:
            Math.round(
              parseFloat(
                (Math.round(parseFloat(routingRecordList[a].routingOperation_processTime) * 10000) / 10000 / 60 +
                  Math.round(parseFloat(routingRecordList[a].routingOperation_prepareTime) * 10000) / 10000 / 5000) *
                  LaborCost
              ) * 10000
            ) / 10000,
          OtherCost: Math.round(parseFloat((Math.round(parseFloat(routingRecordList[a].routingOperation_processTime) * 10000) / 10000 / 60) * OtherCost) * 10000) / 10000,
          IndirectCosts: Math.round(parseFloat((Math.round(parseFloat(routingRecordList[a].routingOperation_processTime) * 10000) / 10000 / 60) * IndirectCosts) * 10000) / 10000
        };
        RoutingArray.push(pushRouting);
      }
    }
    let children = BomListapiResponse.data[0].children;
    var childrenList = new Array();
    var children_index;
    for (var a = 0; a < children.length; a++) {
      //第一层不参与
      children_index = {
        index: a + 1,
        children: children[a]
      };
      childrenList.push(children_index);
    }
    var childrenListV1 = new Array();
    var BomArray = new Array();
    var notHave = new Array();
    while (childrenList.length > 0) {
      for (var i = 0; i < childrenList.length; i++) {
        var UnitPrice = 0;
        var Amount = 0;
        if (childrenList[i].children.bomUnitName != "PRS" && childrenList[i].children.bomUnitName != "PAIR") {
          var simpleVOs = new Array();
          var simpleVO = {
            field: "purchaseOrders.productsku.cCode",
            op: "eq",
            value1: childrenList[i].children.materialCode
          };
          simpleVOs.push(simpleVO);
          var queryOrders = new Array();
          var queryOrder = {
            field: "vouchdate",
            order: "desc"
          };
          queryOrders.push(queryOrder);
          var purchaseorderListBody = {
            pageIndex: 1,
            pageSize: 100,
            isSum: false,
            simpleVOs: simpleVOs,
            queryOrders: queryOrders
          };
          var purchaseorderListApiResponse = JSON.parse(openLinker("POST", purchaseorderListURL, AppCode, JSON.stringify(purchaseorderListBody)));
          if (purchaseorderListApiResponse.data.recordCount > 0) {
            (UnitPrice = purchaseorderListApiResponse.data.recordList[0].oriTaxUnitPrice),
              (Amount =
                UnitPrice *
                childrenList[i].children.numeratorQuantity *
                (purchaseorderListApiResponse.data.recordList[0].purchaseOrders_priceQty / purchaseorderListApiResponse.data.recordList[0].qty));
          }
          if (UnitPrice == 0) {
            productV1ListBody.code = childrenList[i].children.materialCode;
            var productV1ListApiResponse = JSON.parse(openLinker("POST", productV1ListUrl, AppCode, JSON.stringify(productV1ListBody)));
            UnitPrice = Math.round(parseFloat(productV1ListApiResponse.data.recordList[0].detail.fPrimeCosts) * 10000) / 10000;
            if (productV1ListApiResponse.data.recordList[0].detail.fPrimeCosts == null) {
              notHave.push(productV1ListBody.code);
              Amount = 0;
              UnitPrice = 0;
            } else {
              //物料创建 辅计量计算
              if (productV1ListApiResponse.data.recordList[0].enableAssistUnit) {
                var productDetailUrl =
                  "https://www.example.com/" + "?&&id=" + productV1ListApiResponse.data.recordList[0].id + "&&orgId=3048554136490240"; //物料档案详情查询
                var productDetailApiResponse = JSON.parse(openLinker("GET", productDetailUrl, AppCode, null));
                Amount = (UnitPrice * childrenList[i].children.numeratorQuantity) / productDetailApiResponse.data.productAssistUnitExchanges[0].mainUnitCount;
              } else {
                if (Amount == undefined || Amount == NaN) {
                  Amount = 0;
                }
              }
            }
          }
        }
        var lastquantity = 1;
        if (childrenList[i].children.bomUnitName == "CD3") {
          lastquantity = childrenList[i].lastBomComponent_numeratorQuantity;
        }
        var pushBomBody = {
          index: childrenList[i].index,
          BomComponent_numeratorQuantity: Math.round(parseFloat(childrenList[i].children.numeratorQuantity) * 10000) / 10000, //数
          BomComponent_bomUnitName: childrenList[i].children.bomUnitName, //单位
          MaterialNumb_Name: childrenList[i].children.productId,
          MaterialNumb: childrenList[i].children.materialCode,
          MaterialNumb_Name_name: childrenList[i].children.materialName,
          Batch: childrenList[i].children.bomUnitName == "PRS" || childrenList[i].children.bomUnitName == "PAIR" ? 1 : "",
          UOM: childrenList[i].children.bomUnitName == "PRS" || childrenList[i].children.bomUnitName == "PAIR" ? "PAIR" : "",
          UnitPrice: childrenList[i].children.bomUnitName == "PRS" || childrenList[i].children.bomUnitName == "PAIR" ? "" : Math.round(parseFloat(UnitPrice) * 10000) / 10000,
          Amount: childrenList[i].children.bomUnitName == "PRS" || childrenList[i].children.bomUnitName == "PAIR" ? "" : Math.round(parseFloat(Amount * lastquantity) * 10000) / 10000 //
        };
        BomArray.push(pushBomBody);
        if (childrenList[i].children.bomUnitName == "PRS" || childrenList[i].children.bomUnitName == "PAIR") {
          RoutingListBody.code = childrenList[i].children.materialCode;
          RoutingListApiResponse = JSON.parse(openLinker("POST", RoutingListUrl, AppCode, JSON.stringify(RoutingListBody)));
          routingRecordList = RoutingListApiResponse.data.recordList;
          if (RoutingListApiResponse.data.recordCount != 0) {
            for (var a = 0; a < RoutingListApiResponse.data.recordCount; a++) {
              var LaborCost;
              var OtherCost;
              var IndirectCosts;
              for (var p = 0; p < workcenterListApiResponse.data.recordList.length; p++) {
                if (routingRecordList[a].routingOperation_workCenterId == workcenterListApiResponse.data.recordList[p].id) {
                  LaborCost = parseFloat(workcenterListApiResponse.data.recordList[p].mainAtt.define1);
                  OtherCost = parseFloat(workcenterListApiResponse.data.recordList[p].mainAtt.define2);
                  IndirectCosts = parseFloat(workcenterListApiResponse.data.recordList[p].mainAtt.define3);
                }
              }
              var pushRouting = {
                index: childrenList[i].index,
                MaterialCode_Name: routingRecordList[a].productId,
                MaterialCode: routingRecordList[a].productCode,
                MaterialCode_Name_name: routingRecordList[a].productName,
                WorkCenter: routingRecordList[a].routingOperation_workCenterIdName,
                PreparationTime: Math.round(parseFloat(routingRecordList[a].routingOperation_prepareTime) * 10000) / 10000,
                ProcessingTime: Math.round(parseFloat(routingRecordList[a].routingOperation_processTime) * 10000) / 10000,
                Description: replace(routingRecordList[a].detail_define3 + "\n" + routingRecordList[a].detail_define1, "||", ""),
                LaborCost:
                  Math.round(
                    parseFloat(
                      (Math.round(parseFloat(routingRecordList[a].routingOperation_processTime) * 10000) / 10000 / 60 +
                        Math.round(parseFloat(routingRecordList[a].routingOperation_prepareTime) * 10000) / 10000 / 5000) *
                        LaborCost
                    ) * 10000
                  ) / 10000,
                OtherCost: Math.round(parseFloat((Math.round(parseFloat(routingRecordList[a].routingOperation_processTime) * 10000) / 10000 / 60) * OtherCost) * 10000) / 10000,
                IndirectCosts: Math.round(parseFloat((Math.round(parseFloat(routingRecordList[a].routingOperation_processTime) * 10000) / 10000 / 60) * IndirectCosts) * 10000) / 10000
              };
              RoutingArray.push(pushRouting);
            }
          }
        }
        if (childrenList[i].children.children != undefined) {
          for (var j = 0; j < childrenList[i].children.children.length; j++) {
            children_index = {
              index: childrenList[i].index + "|" + (j + 1),
              lastBomComponent_numeratorQuantity: Math.round(parseFloat(childrenList[i].children.numeratorQuantity) * 10000) / 10000,
              children: childrenList[i].children.children[j]
            };
            childrenListV1.push(children_index);
          }
        }
      }
      childrenList = new Array();
      childrenList = childrenListV1;
      childrenListV1 = new Array();
    }
    var ProductQuotationBody = {
      BomArray: BomArray,
      RoutingArray: RoutingArray,
      notHave: notHave,
      gauge: gauge
    };
    return { ProductQuotationBody };
  }
}
exports({ entryPoint: MyAPIHandler });