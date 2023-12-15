let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const Id = request.id;
    // 声明数组将合并的集合保存到数组中
    var array = new Array();
    var arrays = new Array();
    // 声明集合将取到的数据合并进list中
    var list = {};
    var lists = {};
    // 查询主表（可能是产成品，半成品）
    const main = "select * from ed.bom.Bom where productId = '" + Id + "'";
    const mainList = ObjectStore.queryByYonQL(main, "engineeringdata");
    // 获取主表第一条数据的id
    const dd = mainList[0].id;
    // 根据主表查到的id去查询子表（可能是原料、半成品）
    const son = "select * from ed.bom.BomComponent where bomId = '" + dd + "'";
    const sonList = ObjectStore.queryByYonQL(son, "engineeringdata");
    // 遍历子表数据
    for (var j = 0; j < sonList.length; j++) {
      // 获取子表数据中的物料id
      var ProductID = sonList[j].productId;
      // 根据子表查询出来的物料id去查询物料
      let material = "select * from pc.product.Product where id = '" + ProductID + "'";
      let materialList = ObjectStore.queryByYonQL(material, "productcenter");
      // 遍历物料数据
      for (var k = 0; k < materialList.length; k++) {
        var classificationID = materialList[k].manageClass;
        var classificationSql = "select * from pc.cls.ManagementClass where id = '" + classificationID + "'";
        var classificationList = ObjectStore.queryByYonQL(classificationSql, "productcenter");
        for (var l = 0; l < classificationList.length; l++) {
          // 将取到的数据合并到list集合中
          list = {
            productId: ProductID,
            subPartCode: materialList[k].id,
            subPartCode_code: materialList[k].code,
            subPartName: materialList[k].name,
            model: materialList[k].model,
            materialSpecification: materialList[k].modelDescription,
            numberSubParts: sonList[j].numeratorQuantity,
            materialClassification_name: classificationList[l].name,
            unitPrice: "0"
          };
          // 放入数组
          array.push(list);
        }
        // 查询物料清单子表下的主表信息
        let materialDetailedMain = "select * from ed.bom.Bom where productId = '" + ProductID + "'";
        let materialDetailedMainList = ObjectStore.queryByYonQL(materialDetailedMain, "engineeringdata");
        // 判断数组长度
        if (materialDetailedMainList.length != 0) {
          // 获取主表第一条数据的id
          let pid = materialDetailedMainList[0].id;
          // 根据主表id查询物料清单子表
          let materialDetailedSon = "select * from ed.bom.BomComponent where bomId = " + pid + "";
          let materialDetailedSonList = ObjectStore.queryByYonQL(materialDetailedSon, "engineeringdata");
          // 判断数组长度
          if (materialDetailedSonList.length > 0) {
            // 遍历子表的信息
            for (var h = 0; h < materialDetailedSonList.length; h++) {
              // 获取子表数据中的物料id
              var Producid = materialDetailedSonList[h].productId;
              // 根据子表查到的物料id去查物料
              let materials = "select * from pc.product.Product where id = '" + Producid + "'";
              var materialsList = ObjectStore.queryByYonQL(materials, "productcenter");
              // 遍历物料数据
              for (var g = 0; g < materialsList.length; g++) {
                var classificationid = materialsList[g].manageClass;
                var classSql = "select * from pc.cls.ManagementClass where id = '" + classificationid + "'";
                var classList = ObjectStore.queryByYonQL(classSql, "productcenter");
                for (var m = 0; m < classList.length; m++) {
                  // 组装数据
                  list = {
                    productId: Producid,
                    subPartCode: materialsList[g].id,
                    numberSubParts: materialDetailedSonList[h].numeratorQuantity,
                    subPartCode_code: materialsList[g].code,
                    subPartName: materialsList[g].name,
                    model: materialsList[g].model,
                    materialSpecification: materialsList[g].modelDescription,
                    materialClassification_name: classList[m].name,
                    unitPrice: "0"
                  };
                  // 放入数组
                  array.push(list);
                }
              }
            }
          }
        }
      }
    }
    // 遍历组装好的数据
    for (var arr = 0; arr < array.length; arr++) {
      // 获取物料id
      var kid = array[arr].productId;
      // 根据获取的物料id去查询采购入库子表
      var purchase = "select * from	pu.purchaseorder.PurchaseOrders where product = '" + kid + "' order by pubts desc";
      var purchaseList = ObjectStore.queryByYonQL(purchase, "upu");
      // 判断数组长度
      if (purchaseList.length > 0) {
        // 判断金额字段是否存在
        var res16 = includes(JSON.stringify(purchaseList[0].oriUnitPrice), "oriUnitPrice");
        // 赋值
        var number = 0;
        // 判断返回的结果
        if (res16 == false) {
          // 赋值
          number = purchaseList[0].oriUnitPrice;
        }
        // 组装数据
        lists = {
          productId: array[arr].productId,
          subPartCode: array[arr].subPartCode,
          numberSubParts: array[arr].numberSubParts,
          subPartCode_code: array[arr].subPartCode_code,
          subPartName: array[arr].subPartName,
          model: array[arr].model,
          materialSpecification: array[arr].materialSpecification,
          materialClassification_name: array[arr].materialClassification_name,
          unitPrice: number
        };
        // 放入数组
        arrays.push(lists);
      } else {
        // 组装数据
        lists = {
          productId: array[arr].productId,
          subPartCode: array[arr].subPartCode,
          numberSubParts: array[arr].numberSubParts,
          subPartCode_code: array[arr].subPartCode_code,
          subPartName: array[arr].subPartName,
          model: array[arr].model,
          materialSpecification: array[arr].materialSpecification,
          materialClassification_name: array[arr].materialClassification_name,
          unitPrice: "0"
        };
        // 放入数组
        arrays.push(lists);
      }
    }
    return { arrays };
  }
}
exports({ entryPoint: MyAPIHandler });