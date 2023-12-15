let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let newdata = param.data[0];
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var productname = newdata.name.zh_CN; //名称
    var status = "1"; //已上架
    var owner = "FSUID_0334CF28165A2D78A6B9297DDCD0D6BF"; //负责人  默认陈庆禄
    var category = newdata.manageClass; //物料分类id
    var price = newdata.detail.fMarkPrice == null ? "0.0" : newdata.detail.fMarkPrice; //价格
    var modelDescription = newdata.modelDescription; //规格说明
    var model = newdata.model; //型号
    var mnemonicCode = newdata.detail.mnemonicCode; //助记码
    var barCode = newdata.detail.barCode; //条形码
    var erpCodeValue = newdata.erpCode; //外部编码  产品id
    var queryUnit = "select code,name from pc.unit.Unit where id='" + newdata.unit + "'";
    var unitRes = ObjectStore.queryByYonQL(queryUnit, "productcenter");
    var unit = null;
    if (unitRes.length == 1) {
      var unitValue = unitRes[0].name; //单位
      if (unitValue.indexOf("个") > -1) {
        unit = "1";
      } else if (unitValue.indexOf("块") > -1) {
        unit = "2";
      } else if (unitValue.indexOf("只") > -1) {
        unit = "3";
      } else if (unitValue.indexOf("把") > -1) {
        unit = "4";
      } else if (unitValue.indexOf("枚") > -1) {
        unit = "5";
      } else if (unitValue.indexOf("条") > -1) {
        unit = "6";
      } else if (unitValue.indexOf("瓶") > -1) {
        unit = "7";
      } else if (unitValue.indexOf("盒") > -1) {
        unit = "8";
      } else if (unitValue.indexOf("套") > -1) {
        unit = "9";
      } else if (unitValue.indexOf("箱") > -1) {
        unit = "10";
      } else if (unitValue.indexOf("米") > -1) {
        unit = "11";
      } else if (unitValue.indexOf("千克") > -1) {
        unit = "12";
      } else if (unitValue.indexOf("吨") > -1) {
        unit = "13";
      } else if (unitValue.indexOf("台") > -1) {
        unit = "TAI";
      } else if (unitValue.indexOf("包") > -1) {
        unit = "bao";
      } else if (unitValue.indexOf("桶") > -1) {
        unit = "tong";
      } else if (unitValue.indexOf("次") > -1) {
        unit = "ci";
      } else if (unitValue.indexOf("元") > -1) {
        unit = "yuan";
      } else if (unitValue.indexOf("卷") > -1) {
        unit = "juan";
      } else if (unitValue.indexOf("袋") > -1) {
        unit = "D";
      } else if (unitValue.indexOf("托") > -1) {
        unit = "TUO";
      } else if (unitValue.indexOf("罐装") > -1) {
        unit = "Guan";
      } else {
        unit = unitRes[0].code;
      }
    } else {
      throw new Error("推送纷享销客失败,YS校验：纷享销客系统无所选的【主计量单位】！");
    }
    var queryClass = "select * from pc.cls.ManagementClass where id='" + category + "'";
    var classRes = ObjectStore.queryByYonQL(queryClass, "productcenter");
    var categoryValue = null;
    if (classRes.length == 1) {
      categoryValue = classRes[0].managementClassCharacter.attrext3;
    } else {
      throw new Error("推送纷享销客失败,YS校验：所选【物料分类】无对应纷享销客系统主键！");
    }
    let func1 = extrequire("GZTBDM.fxxk.getToken");
    let res = func1.execute(null);
    var fxxkToken = res.fxxkToken;
    var corpId = res.corpId; //企业id
    //判断是否已同步
    if (erpCodeValue == null) {
      //新增
      var addurl = "https://www.example.com/"; //创建对象网址(产品、商品、规格表网址相同)
      var object_data = {
        name: productname,
        price: price, //标准价格
        mnemonic_code: mnemonicCode, //助记码
        barcode: barCode, //条形码
        unit: unit, //单位
        product_status: status, //上下架
        product_code: newdata.code,
        owner: [owner], //负责人
        product_category_id: categoryValue, //分类
        dataObjectApiName: "ProductObj"
      };
      if (model != null) {
        //型号
        object_data.model = model.zh_CN;
      }
      if (modelDescription != null) {
        //规格属性
        object_data.product_spec = modelDescription.zh_CN;
      }
      //新增产品
      var addProductObjBody = {
        corpAccessToken: fxxkToken,
        corpId: corpId,
        currentOpenUserId: owner,
        data: {
          object_data: object_data
        }
      };
      var addProductObjResponse = postman("POST", addurl, JSON.stringify(header), JSON.stringify(addProductObjBody));
      var addProductObjRes = JSON.parse(addProductObjResponse);
      if (addProductObjRes.errorCode != "0") {
        throw new Error("推送纷享销客失败,CRM返回：" + addProductObjRes.errorMessage);
      }
      var ProductObjId = addProductObjRes.dataId; //产品id
      param.data[0].set("erpCode", ProductObjId);
    } else {
      //修改
      var updateUrl = "https://www.example.com/";
      var updateobject_data = {
        name: productname,
        price: price, //标准价格
        product_status: status, //上下架
        owner: [owner], //负责人
        product_category_id: categoryValue, //分类
        unit: unit, //单位
        product_code: newdata.code,
        dataObjectApiName: "ProductObj",
        _id: erpCodeValue
      };
      if (mnemonicCode != null) {
        //助记码
        updateobject_data.mnemonic_code = mnemonicCode;
      }
      if (barCode != null) {
        //条形码
        updateobject_data.barcode = barCode;
      }
      if (model != null) {
        //型号
        updateobject_data.model = model.zh_CN;
      }
      if (modelDescription != null) {
        //规格属性
        updateobject_data.product_spec = modelDescription.zh_CN;
      }
      //修改产品
      var updateProductObjBody = {
        corpAccessToken: fxxkToken,
        corpId: corpId,
        currentOpenUserId: owner,
        data: {
          object_data: updateobject_data
        }
      };
      var updateProductObjResponse = postman("POST", updateUrl, JSON.stringify(header), JSON.stringify(updateProductObjBody));
      var updateProductObjRes = JSON.parse(updateProductObjResponse);
      if (updateProductObjRes.errorCode != "0") {
        throw new Error("修改后同步纷享销客失败,CRM返回：" + updateProductObjRes.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });