let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //组装数据
    var assemble = {};
    var assembleList = new Array();
    //拿到全部数据
    var returnData = param.return;
    var defineId = "";
    if (returnData.hasOwnProperty("productCharacterDef")) {
      var attrext = returnData.productCharacterDef;
      if (attrext.hasOwnProperty("attrext26")) {
        defineId = attrext.attrext26;
        if (defineId == null) {
          defineId = "否";
        }
      } else {
        defineId = "否";
      }
    } else {
      defineId = "否";
    }
    var logCode = returnData.code;
    console.log("物料编码【" + logCode + "】，是否同步有赞【" + defineId + "】");
    if (defineId != "是") {
      return { defineId };
    }
    //拿到ID
    var mainId = returnData.id;
    //查询物料创建数据库
    var materialSql = "select * from pc.product.Product where id = '" + mainId + "'";
    var materialRes = ObjectStore.queryByYonQL(materialSql, "productcenter");
    if (materialRes.length != 0) {
      //获取 物料主键
      var Ids = materialRes[0].id;
      //获取 商品名称
      var name = materialRes[0].name;
      //获取 商品编码
      var spu_code = materialRes[0].code;
      //获取物料性质(物料属性)
      var xingZhi = materialRes[0].realProductAttribute;
      if (xingZhi == 1) {
        //实体物料  获取 实物物料属性
        if (materialRes[0].realProductAttributeType != undefined) {
          var realProductAttributeType = materialRes[0].realProductAttributeType;
          if (realProductAttributeType == 1) {
            var realProductAttributeTypes = "0";
          } else if (realProductAttributeType == 3) {
            var realProductAttributeTypes = "0";
          } else if (realProductAttributeType == 4) {
            var realProductAttributeTypes = "0";
          } else if (realProductAttributeType == 20) {
            var realProductAttributeTypes = "0";
          } else if (realProductAttributeType == 2) {
            var realProductAttributeTypes = "0";
          }
        } else {
          throw new Error(" -- 商品名称:" + name + ",编码:" + spu_code + ",实物物料属性查询为空");
        }
      } else if (xingZhi == 2) {
        //虚拟物料
        if (materialRes[0].virtualProductAttribute != undefined) {
          var realProductAttributeType = materialRes[0].virtualProductAttribute;
          if (realProductAttributeType == 1) {
            var realProductAttributeTypes = "61";
          } else if (realProductAttributeType == 7) {
            var realProductAttributeTypes = "61";
          } else if (realProductAttributeType == 10) {
            var realProductAttributeTypes = "61";
          } else if (realProductAttributeType == 4) {
            var realProductAttributeTypes = "61";
          } else if (realProductAttributeType == 9) {
            var realProductAttributeTypes = "61";
          } else if (realProductAttributeType == 11) {
            var realProductAttributeTypes = "61";
          } else if (realProductAttributeType == 3) {
            var realProductAttributeTypes = "61";
          } else if (realProductAttributeType == 2) {
            var realProductAttributeTypes = "61";
          }
        } else {
          throw new Error(" -- 商品名称:" + name + ",编码:" + spu_code + ",虚拟物料属性查询为空");
        }
      }
      //获取 商品分类 查库
      var manageClassId = materialRes[0].productClass;
      var productSql = "select * from pc.cls.PresentationClass where id = '" + manageClassId + "'";
      var productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
      if (productRes.length != 0) {
        var category_name = productRes[0].name;
      } else {
        throw new Error(" -- 商品名称:" + name + ",编码:" + spu_code + ",商品分类查询为空");
      }
      //查询物料详情数据库 inTaxrate(进项税率（%）)   outTaxrate(销项税率（%）)
      var productDetailSql = "select * from pc.product.ProductDetail where productId = '" + Ids + "'";
      var productDetailRes = ObjectStore.queryByYonQL(productDetailSql, "productcenter");
      if (productDetailRes.length == 0) {
        throw new Error(" -- 商品名称:" + name + ",编码:" + spu_code + ",税率查询为空");
      }
      //进项税率 非必传
      var input_tax = productDetailRes[0].inTaxrate;
      if (input_tax != undefined) {
        var inputTaxSql = "select * from archive.taxArchives.TaxRateArchive where id = '" + input_tax + "'";
        var inputTaxRes = ObjectStore.queryByYonQL(inputTaxSql, "yonbip-fi-taxpubdoc");
        if (inputTaxRes.length != 0) {
          var input_tax_rate = inputTaxRes[0].ntaxRate;
        } else {
          throw new Error(" -- 进项税率查询为空 -- ");
        }
      }
      //销项税率 必传
      var output_tax = productDetailRes[0].outTaxrate != undefined ? productDetailRes[0].outTaxrate : 0;
      if (output_tax == 0) {
        throw new Error(" -- 商品名称:" + name + ",编码:" + spu_code + ",销项税率查询为空");
      } else {
        var outputTaxSql = "select * from archive.taxArchives.TaxRateArchive where id = '" + output_tax + "'";
        var outputTaxRes = ObjectStore.queryByYonQL(outputTaxSql, "yonbip-fi-taxpubdoc");
        if (outputTaxRes.length != 0) {
          var output_tax_rate = outputTaxRes[0].ntaxRate;
        } else {
          throw new Error(" -- 销项税率查询为空 -- ");
        }
      }
      //获取 供应商
      var supplierId = productDetailRes[0].productVendor;
      if (supplierId != undefined) {
        var supplierSql = "select * from aa.vendor.Vendor where id = '" + supplierId + "'";
        var supplierRes = ObjectStore.queryByYonQL(supplierSql, "yssupplier");
        if (supplierRes.length != 0) {
          var supplier_code = supplierRes[0].code;
        } else {
          throw new Error(" -- 供应商查询为空 -- ");
        }
      }
      //获取 商品条码
      var barCode = productDetailRes[0].barCode != undefined ? productDetailRes[0].barCode : "";
      //建议零售价
      if (productDetailRes[0].fMarkPrice != undefined) {
        var fMarkPrice = productDetailRes[0].fMarkPrice;
      }
      //判断零售价是否为 ‘0’
      if (fMarkPrice == 0) {
        return { fMarkPrice };
      }
      //启用辅计量
      if (materialRes[0].enableAssistUnit != undefined) {
        var enableAssistUnit = materialRes[0].enableAssistUnit;
      }
    } else {
      throw new Error(" -- 物料查询为空 -- ");
    }
    //获取保存时状态
    var status = returnData.eventNotify_status;
    if (status == "Update") {
      assemble.type = "2";
      assemble.name = name;
      assemble.spu_code = spu_code;
      assemble.category_name = category_name;
      assemble.output_tax_rate = output_tax_rate;
      assemble.input_tax_rate = input_tax_rate;
      assemble.supplier_code = supplier_code;
      assemble.spu_no = Ids; //商品条码（店铺下唯一）
      assemble.spu_type = realProductAttributeTypes; //商品类型
      assemble.price = fMarkPrice; //商品单价，单位：分（电子卡券产品必传）
    } else if (status == "Insert") {
      assemble.type = "1";
      assemble.name = name;
      assemble.spu_code = spu_code;
      assemble.category_name = category_name;
      assemble.output_tax_rate = output_tax_rate;
      assemble.input_tax_rate = input_tax_rate;
      assemble.supplier_code = supplier_code;
      assemble.spu_no = Ids; //商品条码（店铺下唯一）
      assemble.spu_type = realProductAttributeTypes; //商品类型
      assemble.price = fMarkPrice; //商品单价，单位：分（电子卡券产品必传）
    }
    var assembleStr = JSON.stringify(assemble);
    var uuidRes = uuid();
    var uuidResRes = replace(uuidRes, "-", "");
    var uuidResResres = substring(uuidResRes, 0, 16);
    //获取时间戳
    var timestamp = new Date().getTime();
    var data = {
      msgId: uuidResResres, //"e823a2oz22n2xm2z"
      type: "product_change",
      data: assembleStr,
      appkey: "yourkeyHere",
      secret: "yoursecretHere",
      timestamp: timestamp
    };
    var body = {
      param: data
    };
    let strResponse = postman("POST", "http://36.136.101.12:9996/sine/getSigne", null, JSON.stringify(body));
    var jj = JSON.parse(strResponse);
    var singe = jj.singe;
    //拼接参数
    var requestUrl = "https://www.example.com/" + timestamp + "&sign=" + singe;
    //调用保存
    var yzBody = {
      msgId: uuidResResres,
      type: "product_change",
      data: assembleStr
    };
    yzBody = JSON.stringify(yzBody);
    console.log("物料编码【" + logCode + "】，Res：" + yzBody);
    let yzRes = postman("POST", requestUrl, null, yzBody);
    console.log("物料编码【" + logCode + "】，Res：" + yzRes);
    var returns = JSON.parse(yzRes);
    if (returns.errcode == 0) {
      var msg = returns.msg;
      return { msg };
    } else {
      throw new Error(" -- 商品名称:【 " + name + "】,编码:【" + spu_code + "】,保存失败。失败原因:【" + returns.msg + "】");
    }
    return { returns };
  }
}
exports({ entryPoint: MyTrigger });