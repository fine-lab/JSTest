let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var array = request.dataArray;
    var str = "";
    var mainheadmap = new Map();
    for (var i = 0; i < array.length; i++) {
      var id = array[i].selectedId;
      str = str + "'" + id + "',";
      mainheadmap.set(id, array[i].mainhead);
    }
    var str1 = substring(str, 0, str.length - 1);
    var sql = "select productName.id,productName.product_coding,id,batchNumber from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDetails where IssueDocInfo_id in(" + str1 + ")";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    if (result.length > 0) {
      var str2 = "";
      var str3 = "";
      var productId = "";
      let dataMapId = new Map();
      let productIdMap = new Map();
      let updateData = {
        id: "",
        sonID: "",
        productionDate: "",
        validityTerm: "",
        registNo: "",
        zhiliangzhuangkuang: "",
        // 生产企业名称
        enterprise_name: "",
        // 储运条件
        transportation_conditions: "",
        // 注册人/备案人名称
        nameRegistrant: ""
      };
      for (var j = 0; j < result.length; j++) {
        var code = result[j].productName_product_coding;
        var number = result[j].batchNumber;
        var id = result[j].id;
        productId = productId + "'" + result[j].productName_id + "',";
        str2 = str2 + "'" + code + "',";
        str3 = str3 + "'" + number + "',";
        updateData.id = result[j].IssueDocInfo_id;
        updateData.sonID = id;
        dataMapId.set(productId + "@@##" + number, updateData);
        productIdMap.set(productId, updateData);
      }
      var str4 = substring(str2, 0, str2.length - 1);
      var str5 = substring(str3, 0, str3.length - 1);
      var productIdStr = substring(productId, 0, productId.length - 1);
      var inventorySql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory where batch_nbr in(" + str5 + ") and sku in(" + str4 + ")";
      var inventoryResult = ObjectStore.queryByYonQL(inventorySql, "developplatform");
      if (inventoryResult.length > 0) {
        for (var x = 0; x < inventoryResult.length; x++) {
          // 有效期
          var XPIRE_DATE = inventoryResult[x].xpire_date;
          // 生产日期
          var mfg_DATE = inventoryResult[x].mfg_date;
          // 注册证号
          var po_NBR = inventoryResult[x].product_umber;
          // 质量状态
          var batchnbr = inventoryResult[x].batch_nbr;
          var sku = inventoryResult[x].sku;
          var key = batchnbr + "@@##" + sku;
          if (dataMapId.hasOwnProperty(key)) {
            dataMapId.get(key).productionDate = mfg_DATE;
            dataMapId.get(key).validityTerm = XPIRE_DATE;
            dataMapId.get(key).registNo = po_NBR;
          }
        }
      }
      // 根据产品Id批次号查询入库单子表数据
      var rkSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where batch_number in(" + str5 + ") and product_code in(" + productIdStr + ")";
      var rkResult = ObjectStore.queryByYonQL(sql, "developplatform");
      throw new Error("1111" + JSON.stringify(rkResult));
      if (rkResult.length > 0) {
        for (var y = 0; y < rkResult.length; y++) {
          // 有效期
          var XPIRE_DATE = rkResult[y].term_validity;
          // 生产日期
          var mfg_DATE = rkResult[y].date_manufacture;
          // 注册证号
          var po_NBR = rkResult[y].registration_number;
          var batchnbr = rkResult[y].batch_number;
          var sku = rkResult[y].product_code;
          var idkey = id + "@@##" + sku;
          if (!dataMapId.hasOwnProperty(idkey)) {
            dataMapId.get(idkey).productionDate = mfg_DATE;
            dataMapId.get(idkey).validityTerm = XPIRE_DATE;
            dataMapId.get(idkey).registNo = po_NBR;
          }
        }
      }
      // 根据产品id查询产品注册证
      var productSonSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id in(" + productIdStr + ")";
      var productResult = ObjectStore.queryByYonQL(productSonSql, "developplatform");
      if (productResult.length > 0) {
        for (let item of dataMapId.keys()) {
          var ids = getKey(item);
          for (var z = 0; z < productResult.length; z++) {
            // 生产企业名称
            var enterprise_name = productResult[z].production_enterprise_name;
            // 储运条件
            var transportation_conditions = productResult[z].storage_conditions;
            // 注册人/备案人名称
            var nameRegistrant = productResult[z].nameRegistrant;
            var proID = productResult[z].productInformation_id;
            if (ids == proID) {
              productIdMap.get(item).enterprise_name = enterprise_name;
              productIdMap.get(item).transportation_conditions = transportation_conditions;
              productIdMap.get(item).nameRegistrant = nameRegistrant;
            }
          }
        }
      }
      if (productIdMap.size > 0) {
        let updateArrays = new Array();
        let mapmap = new Map();
        for (let item of productIdMap.keys()) {
          let datajson = productIdMap.get(item);
          let mainid = datajson.id;
          let sonid = datajson.sonID;
          if (mapmap.hasOwnProperty(mainid)) {
            let updateArray = mapmap.get(mainid);
            datajson.id = datajson.sonID;
            delete datajson.sonID;
            updateArray.push(datajson);
          } else {
            let updateArray = new Array();
            datajson.id = datajson.sonID;
            delete datajson.sonID;
            updateArray.push(datajson);
            mapmap.set(mainid, updateArray);
          }
        }
        if (mapmap.size > 0) {
          for (let item of mapmap.keys()) {
            let updatda = {
              id: item,
              modifier: mainheadmap.get(item).modifier,
              PreparedBy: mainheadmap.get(item).PreparedBy,
              IssueDetailsList: mapmap.get(item)
            };
            updateArrays.push();
          }
          var res = ObjectStore.updateBatch("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", updateArrays, "93ffc3ce");
          return { res };
        }
      }
    }
    function getKey(key) {
      let res1 = JSON.stringify(key.split("@@##"));
      let res2 = JSON.parse(res1);
      return res2[0];
    }
  }
}
exports({ entryPoint: MyAPIHandler });