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
    let List = {
      id: "youridHere",
      name: "kkk"
    };
    function Test(List) {
      if (List.length > 0) {
        throw new Error("123");
      }
      throw new Error("100");
    }
    throw new Error("200");
    // 获取主表第一条数据的id
    const dd = mainList[0].id;
    // 根据主表查到的id去查询子表（可能是原料、半成品）
    const son = "select * from ed.bom.BomComponent where bomId = '" + dd + "'";
    const sonList = ObjectStore.queryByYonQL(son, "engineeringdata");
    // 遍历子表数据 第一层
    for (var j = 0; j < sonList.length; j++) {
      // 获取子表数据中的物料id
      var ProductID = sonList[j].productId;
      // 子表id
      var SunId = sonList[j].id;
      // 根据子表查询出来的物料id去查询物料
      let material = "select * from pc.product.Product where id = '" + ProductID + "'";
      let materialList = ObjectStore.queryByYonQL(material, "productcenter");
      // 遍历物料数据
      for (var k = 0; k < materialList.length; k++) {
        let classificationID = materialList[k].manageClass;
        let realProductAttributeType = materialList[k].realProductAttributeType;
        let classificationSql = "select * from pc.cls.ManagementClass where id = '" + classificationID + "'";
        let classificationList = ObjectStore.queryByYonQL(classificationSql, "productcenter");
        for (var l = 0; l < classificationList.length; l++) {
          // 将取到的数据合并到list集合中
          list = {
            productId: ProductID, // 物料id
            subPartCode: materialList[k].code, // 物料code
            subPartName: materialList[k].name, // 物料名称
            model: materialList[k].model, // 型号
            materialSpecification: materialList[k].modelDescription, // 物料规格
            descriptions: materialList[k].modelDescription, // 物料说明
            numberSubParts: sonList[j].numeratorQuantity, // 子件数量
            subPartCode_manageClass_name: classificationList[l].name, // 物料分类名称
            unitPrice: "0" // 单价
          };
          // 放入数组
          array.push(list);
        }
      }
      // 查询物料清单子表下的主表信息 第二层
      let materialDetailedMain = "select * from ed.bom.Bom where productId = '" + ProductID + "'";
      let materialDetailedMainList = ObjectStore.queryByYonQL(materialDetailedMain, "engineeringdata");
      throw new Error(JSON.stringify(materialDetailedMainList));
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
            let Producid = materialDetailedSonList[h].productId;
            // 根据子表查到的物料id去查物料
            let materials = "select * from pc.product.Product where id = '" + Producid + "'";
            let materialsList = ObjectStore.queryByYonQL(materials, "productcenter");
            // 遍历物料数据
            for (var g = 0; g < materialsList.length; g++) {
              let classificationid = materialsList[g].manageClass;
              let classSql = "select * from pc.cls.ManagementClass where id = '" + classificationid + "'";
              let classList = ObjectStore.queryByYonQL(classSql, "productcenter");
              for (var m = 0; m < classList.length; m++) {
                // 组装数据
                list = {
                  productId: Producid, // 物料id
                  subPartCode: materialsList[g].code, // 物料code
                  numberSubParts: materialDetailedSonList[h].numeratorQuantity, // 子件数量
                  subPartName: materialsList[g].name, // 物料名称
                  model: materialsList[g].model, // 型号
                  materialSpecification: materialsList[g].modelDescription, // 物料规格
                  descriptions: materialsList[k].modelDescription, // 物料说明
                  subPartCode_manageClass_name: classList[m].name, // 物料分类名称
                  unitPrice: "0" // 单价
                };
                // 放入数组
                array.push(list);
              }
            }
            // 查询物料清单子表下的主表信息 第三层
            let DetailedMains = "select * from ed.bom.Bom where productId = '" + Producid + "'";
            let DetailedMainLists = ObjectStore.queryByYonQL(DetailedMains, "engineeringdata");
            throw new Error(JSON.stringify(materialDetailedMainList));
            // 判断数组长度
            if (DetailedMainLists.length != 0) {
              // 获取主表第一条数据的id
              let pid_1 = DetailedMainLists[0].id;
              // 根据主表id查询物料清单子表
              let materialDetailedSon_1 = "select * from ed.bom.BomComponent where bomId = " + pid_1 + "";
              let materialDetailedSonList_1 = ObjectStore.queryByYonQL(materialDetailedSon_1, "engineeringdata");
              // 判断数组长度
              if (materialDetailedSonList_1.length > 0) {
                // 遍历子表的信息
                for (var hh = 0; hh < materialDetailedSonList_1.length; hh++) {
                  // 获取子表数据中的物料id
                  let Producid_1 = materialDetailedSonList_1[hh].productId;
                  // 根据子表查到的物料id去查物料
                  let materials_1 = "select * from pc.product.Product where id = '" + Producid_1 + "'";
                  let materialsList_1 = ObjectStore.queryByYonQL(materials_1, "productcenter");
                  // 遍历物料数据
                  for (var gg = 0; gg < materialsList_1.length; gg++) {
                    let classificationid_1 = materialsList_1[gg].manageClass;
                    let classSql_1 = "select * from pc.cls.ManagementClass where id = '" + classificationid_1 + "'";
                    let classList_1 = ObjectStore.queryByYonQL(classSql_1, "productcenter");
                    for (var mm = 0; mm < classList_1.length; mm++) {
                      // 组装数据
                      list = {
                        productId: Producid_1, // 物料id
                        subPartCode: materialsList_1[gg].code, // 物料code
                        numberSubParts: materialDetailedSonList_1[hh].numeratorQuantity, // 子件数量
                        subPartName: materialsList_1[gg].name, // 物料名称
                        model: materialsList_1[gg].model, // 型号
                        materialSpecification: materialsList_1[gg].modelDescription, // 物料规格
                        descriptions: materialsList_1[gg].modelDescription, // 物料说明
                        subPartCode_manageClass_name: classList_1[m].name, // 物料分类名称
                        unitPrice: "0" // 单价
                      };
                      // 放入数组
                      array.push(list);
                    }
                  }
                  // 查询物料清单子表下的主表信息 第四层
                  let DetailedMains_2 = "select * from ed.bom.Bom where productId = '" + Producid_1 + "'";
                  let DetailedMainLists_2 = ObjectStore.queryByYonQL(DetailedMains_2, "engineeringdata");
                  throw new Error(JSON.stringify(materialDetailedMainList));
                  // 判断数组长度
                  if (DetailedMainLists_2.length != 0) {
                    // 获取主表第一条数据的id
                    let pid_2 = DetailedMainLists_2[0].id;
                    // 根据主表id查询物料清单子表
                    let materialDetailedSon_2 = "select * from ed.bom.BomComponent where bomId = " + pid_2 + "";
                    let materialDetailedSonList_2 = ObjectStore.queryByYonQL(materialDetailedSon_2, "engineeringdata");
                    // 判断数组长度
                    if (materialDetailedSonList_2.length > 0) {
                      // 遍历子表的信息
                      for (var ss = 0; ss < materialDetailedSonList_2.length; ss++) {
                        // 获取子表数据中的物料id
                        let Producid_2 = materialDetailedSonList_2[ss].productId;
                        // 根据子表查到的物料id去查物料
                        let materials_2 = "select * from pc.product.Product where id = '" + Producid_2 + "'";
                        let materialsList_2 = ObjectStore.queryByYonQL(materials_2, "productcenter");
                        // 遍历物料数据
                        for (var qq = 0; qq < materialsList_2.length; qq++) {
                          let classificationid_2 = materialsList_2[qq].manageClass;
                          let classSql_2 = "select * from pc.cls.ManagementClass where id = '" + classificationid_2 + "'";
                          let classList_2 = ObjectStore.queryByYonQL(classSql_2, "productcenter");
                          for (var bb = 0; bb < classList_2.length; bb++) {
                            // 组装数据
                            list = {
                              productId: Producid_2, // 物料id
                              subPartCode: materialsList_2[qq].code, // 物料code
                              numberSubParts: materialDetailedSonList_2[ss].numeratorQuantity, // 子件数量
                              subPartName: materialsList_2[qq].name, // 物料名称
                              model: materialsList_2[qq].model, // 型号
                              materialSpecification: materialsList_2[qq].modelDescription, // 物料规格
                              descriptions: materialsList_2[qq].modelDescription, // 物料说明
                              subPartCode_manageClass_name: classList_2[bb].name, // 物料分类名称
                              unitPrice: "0" // 单价
                            };
                            // 放入数组
                            array.push(list);
                          }
                        }
                        // 查询物料清单子表下的主表信息 第五层
                        let DetailedMains_3 = "select * from ed.bom.Bom where productId = '" + Producid_2 + "'";
                        let DetailedMainLists_3 = ObjectStore.queryByYonQL(DetailedMains_3, "engineeringdata");
                        // 判断数组长度
                        if (DetailedMainLists_3.length != 0) {
                          // 获取主表第一条数据的id
                          let pid_3 = DetailedMainLists_3[0].id;
                          // 根据主表id查询物料清单子表
                          let materialDetailedSon_3 = "select * from ed.bom.BomComponent where bomId = " + pid_3 + "";
                          let materialDetailedSonList_3 = ObjectStore.queryByYonQL(materialDetailedSon_3, "engineeringdata");
                          // 判断数组长度
                          if (materialDetailedSonList_3.length > 0) {
                            // 遍历子表的信息
                            for (var ww = 0; ww < materialDetailedSonList_3.length; ww++) {
                              // 获取子表数据中的物料id
                              let Producid_3 = materialDetailedSonList_3[ww].productId;
                              // 根据子表查到的物料id去查物料
                              let materials_3 = "select * from pc.product.Product where id = '" + Producid_3 + "'";
                              let materialsList_3 = ObjectStore.queryByYonQL(materials_3, "productcenter");
                              // 遍历物料数据
                              for (var op = 0; op < materialsList_3.length; op++) {
                                let classificationid_3 = materialsList_3[op].manageClass;
                                let classSql_3 = "select * from pc.cls.ManagementClass where id = '" + classificationid_3 + "'";
                                let classList_3 = ObjectStore.queryByYonQL(classSql_3, "productcenter");
                                for (var QA = 0; QA < classList_3.length; QA++) {
                                  // 组装数据
                                  list = {
                                    productId: Producid_3, // 物料id
                                    subPartCode: materialsList_3[op].code, // 物料code
                                    numberSubParts: materialDetailedSonList_3[ww].numeratorQuantity, // 子件数量
                                    subPartName: materialsList_3[op].name, // 物料名称
                                    model: materialsList_3[op].model, // 型号
                                    materialSpecification: materialsList_3[op].modelDescription, // 物料规格
                                    descriptions: materialsList_3[op].modelDescription, // 物料说明
                                    subPartCode_manageClass_name: classList_3[QA].name, // 物料分类名称
                                    unitPrice: "0" // 单价
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
                  }
                }
              }
            }
          }
        }
      }
    }
    var linkedList = new Array();
    // 遍历组装好的数据
    for (var arr = 0; arr < array.length; arr++) {
      // 获取物料id
      var kid = array[arr].productId;
      var codes = array[arr].subPartCode;
      var models = array[arr].model;
      let productSunSql = "select planDefaultAttribute from pc.product.ProductDetail where productId = '" + kid + "'";
      let productRes = ObjectStore.queryByYonQL(productSunSql, "productcenter");
      if (productRes.length > 0) {
        var planDefaultAttribute = productRes[0].planDefaultAttribute; // 默认计划属性
        if (planDefaultAttribute == "1") {
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
              var price = purchaseList[0].oriUnitPrice;
              number = Math.round(price * 100) / 100;
            }
            // 组装数据
            lists = {
              subPartCode_code: array[arr].subPartCode, // 物料code
              subPartCode: array[arr].productId, // 物料id
              numberSubParts: array[arr].numberSubParts, // 子件数量
              subPartName: array[arr].subPartName, // 物料名称
              model: array[arr].model, // 型号
              materialSpecification: array[arr].materialSpecification, // 物料规格
              description: array[arr].descriptions, // 物料说明
              subPartCode_manageClass_name: array[arr].subPartCode_manageClass_name, // 物料分类名称
              scheduleDefaultProperties: "1", //计划属性
              unitPrice: number // 单价
            };
            // 放入数组
            arrays.push(lists);
          } else {
            // 组装数据
            lists = {
              subPartCode_code: array[arr].subPartCode, // 物料code
              subPartCode: array[arr].productId, // 物料id
              numberSubParts: array[arr].numberSubParts, // 子件数量
              subPartName: array[arr].subPartName, // 物料名称
              model: array[arr].model, // 型号
              materialSpecification: array[arr].materialSpecification, // 物料规格
              description: array[arr].descriptions, // 物料说明
              subPartCode_manageClass_name: array[arr].subPartCode_manageClass_name, // 物料分类名称
              scheduleDefaultProperties: "1", //计划属性
              unitPrice: "0" // 单价
            };
            // 放入数组
            arrays.push(lists);
          }
        }
        if (planDefaultAttribute == "5") {
          let SubcontractProductSql = "select productId,id from po.order.OrderProduct group by productId";
          let SubcontractProductRes = ObjectStore.queryByYonQL(SubcontractProductSql, "productionorder");
          for (let k = 0; k < SubcontractProductRes.length; k++) {
            let SubcontractID = SubcontractProductRes[k].id;
            let SubcontractProductID = SubcontractProductRes[k].productId;
            if (SubcontractProductID == kid) {
              let SubcontractSunProductSql = "select natTaxUnitPrice from po.order.SubcontractProduct where id = '" + SubcontractID + "'";
              let SubcontractSunProductRes = ObjectStore.queryByYonQL(SubcontractSunProductSql, "productionorder");
              if (SubcontractSunProductRes.length > 0) {
                let natTaxUnitPrice = SubcontractSunProductRes[0].natTaxUnitPrice;
                // 判断金额字段是否存在
                var aount = includes(JSON.stringify(natTaxUnitPrice), "natTaxUnitPrice");
                // 赋值
                var sum = 0;
                // 判断返回的结果
                if (aount == false) {
                  // 赋值
                  var PIC = natTaxUnitPrice;
                  sum = Math.round(PIC * 100) / 100;
                }
                lists = {
                  subPartCode_code: array[arr].subPartCode, // 物料code
                  subPartCode: array[arr].productId, // 物料id
                  numberSubParts: array[arr].numberSubParts, // 子件数量
                  subPartName: array[arr].subPartName, // 物料名称
                  model: array[arr].model, // 型号
                  materialSpecification: array[arr].materialSpecification, // 物料规格
                  description: array[arr].descriptions, // 物料说明
                  subPartCode_manageClass_name: array[arr].subPartCode_manageClass_name, // 物料分类名称
                  scheduleDefaultProperties: "3", //计划属性
                  unitPrice: sum // 单价
                };
                // 放入数组
                arrays.push(lists);
              } else {
                lists = {
                  subPartCode_code: array[arr].subPartCode, // 物料code
                  subPartCode: array[arr].productId, // 物料id
                  numberSubParts: array[arr].numberSubParts, // 子件数量
                  subPartName: array[arr].subPartName, // 物料名称
                  model: array[arr].model, // 型号
                  materialSpecification: array[arr].materialSpecification, // 物料规格
                  description: array[arr].descriptions, // 物料说明
                  subPartCode_manageClass_name: array[arr].subPartCode_manageClass_name, // 物料分类名称
                  scheduleDefaultProperties: "3", //计划属性
                  unitPrice: "0" // 单价
                };
                // 放入数组
                arrays.push(lists);
              }
            }
          }
        }
      }
    }
    return { arrays };
  }
}
exports({ entryPoint: MyAPIHandler });