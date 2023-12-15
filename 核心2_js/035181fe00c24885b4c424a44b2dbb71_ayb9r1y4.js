let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取状态
    var requestData = param.requestData;
    var define6 = 0;
    var num = 0;
    // 判断是string转对象
    if (Object.prototype.toString.call(requestData) === "[object String]") {
      requestData = JSON.parse(param.requestData);
    }
    // 保存后返回的数据
    var data = param.data;
    if ((requestData._status = "Update")) {
      for (var i = data.length - 1; i >= 0; i--) {
        let CollectionDataID = data[i].id;
        let detailsListSql = "select id,collectionType,productionWorkNumber from GT102917AT3.GT102917AT3.collection_nformation_details where collection_information_new_id='" + CollectionDataID + "'";
        let detailsListSqlRes = ObjectStore.queryByYonQL(detailsListSql);
        for (var j = detailsListSqlRes.length - 1; j >= 0; j--) {
          // 获取结算类型
          let collectionType = detailsListSqlRes[j].collectionType;
          // 获取生产工号
          let productionWorkNumber = detailsListSqlRes[j].productionWorkNumber;
          if ("1" == collectionType) {
            // 查询分包合同的比例进行累加
            let subcontractSql = "select id,anzhuangfeishoukuanbilv from GT102917AT3.GT102917AT3.subcontractDetails where id='" + productionWorkNumber + "'";
            let subcontractRes = ObjectStore.queryByYonQL(subcontractSql);
            if (
              "" == subcontractRes[0].anzhuangfeishoukuanbilv ||
              null == subcontractRes[0].anzhuangfeishoukuanbilv ||
              undefined == subcontractRes[0].anzhuangfeishoukuanbilv ||
              subcontractRes[0].hasOwnProperty("anzhuangfeishoukuanbilv") == false
            ) {
              // 更新安装结算比例
              let subcontractObject = { id: productionWorkNumber, anzhuangfeishoukuanbilv: "1" };
              let subcontractSqlRes = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", subcontractObject, "82884516");
              if (subcontractSqlRes.err) {
                throw new Error("回写失败，请重试");
              }
            }
          } else if ("2" == collectionType) {
            // 更新安装结算比例
            let subcontractObject = { id: productionWorkNumber, anzhuangfeishoukuanbilv: "2" };
            let subcontractSqlRes = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", subcontractObject, "82884516");
            if (subcontractSqlRes.err) {
              throw new Error("回写失败，请重试");
            }
          } else if ("3" == collectionType) {
            // 更新安装结算比例
            let subcontractObject = { id: productionWorkNumber, anzhuangfeishoukuanbilv: "3" };
            let subcontractSqlRes = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", subcontractObject, "82884516");
            if (subcontractSqlRes.err) {
              throw new Error("回写失败，请重试");
            }
          }
        }
      }
    } else {
      // 循环每条数据
      for (var i = data.length - 1; i >= 0; i--) {
        let CollectionData = data[i];
        let detailsList = CollectionData.collection_nformation_detailsList;
        // 循环查询子表数据进行判断子表行数据的类型
        for (var j = detailsList.length - 1; j >= 0; j--) {
          // 获取结算类型
          let collectionType = detailsList[j].collectionType;
          // 获取生产工号
          let productionWorkNumber = detailsList[j].productionWorkNumber;
          // 获取主表id
          let subcontract_id = detailsList[j].subcontract_id;
          if ("1" == collectionType) {
            // 查询分包合同的比例进行累加
            let subcontractSql = "select id,anzhuangfeishoukuanbilv from GT102917AT3.GT102917AT3.subcontractDetails where id='" + productionWorkNumber + "'";
            let subcontractRes = ObjectStore.queryByYonQL(subcontractSql);
            if (
              "" == subcontractRes[0].anzhuangfeishoukuanbilv ||
              null == subcontractRes[0].anzhuangfeishoukuanbilv ||
              undefined == subcontractRes[0].anzhuangfeishoukuanbilv ||
              subcontractRes[0].hasOwnProperty("anzhuangfeishoukuanbilv") == false
            ) {
              // 更新安装结算比例
              let subcontractObject = { id: productionWorkNumber, anzhuangfeishoukuanbilv: "1" };
              let subcontractSqlRes = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", subcontractObject, "82884516");
              if (subcontractSqlRes.err) {
                throw new Error("回写失败，请重试");
              }
            }
          } else if ("2" == collectionType) {
            // 更新安装结算比例
            let subcontractObject = { id: productionWorkNumber, anzhuangfeishoukuanbilv: "2" };
            let subcontractSqlRes = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", subcontractObject, "82884516");
            if (subcontractSqlRes.err) {
              throw new Error("回写失败，请重试");
            }
          } else if ("3" == collectionType) {
            // 更新安装结算比例
            let subcontractObject = { id: productionWorkNumber, anzhuangfeishoukuanbilv: "3" };
            let subcontractSqlRes = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", subcontractObject, "82884516");
            if (subcontractSqlRes.err) {
              throw new Error("回写失败，请重试");
            }
          }
        }
      }
    }
    return { param };
  }
}
exports({ entryPoint: MyTrigger });