let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.data;
    let data = requestData[0];
    //更新
    let request = JSON.parse(param.requestData);
    let status = request._status;
    let orgIdquery = request.orgId;
    if (status == "Update") {
      if (data.brand != undefined) {
        let getWlDetail = extrequire("GZTBDM.backDesignerFunction.getBrand");
        data = getWlDetail.execute(null, data.code).record;
        let productDetail = new Array();
        productDetail.push(data.detail);
        data.productDetail = productDetail;
      }
    }
    if (data.pc_productlist_userDefine011 == "Y3") {
      let packageData = {
        packageUnitName: "", //赋码单位名称（箱、托等）
        level: "", //级别（单位关联到几级，如箱托关联，为2级）
        qty: "", //下级数量（包装比例，如：1托里面有几箱）
        price: "" //商品价格(Ys市场价)
      };
      let extAttr = {
        tempName: "自定义属性",
        name: "SKU_ID",
        value: data.id // 物料id
      };
      let extAttrList = [];
      extAttrList.push(extAttr);
      let packageList = [];
      var brandName = "";
      if (data.brand_Name == undefined) {
        brandName = "无";
      } else {
        brandName = data.brand_Name;
      }
      let barCode = "";
      if (data.productDetail[0].barCode != undefined) {
        barCode = data.productDetail[0].barCode;
      }
      let shelfLifeUnit = "";
      let shelfLife = "";
      if (data.productDetail[0].expireDateUnit != undefined) {
        shelfLifeUnit = data.productDetail[0].expireDateUnit != 6 ? data.productDetail[0].expireDateUnit : 3;
        shelfLife = data.productDetail[0].expireDateNo;
      }
      let product = {
        gs1Code: barCode, // 条形码
        code: data.code, //产品代码
        name: data.name.zh_CN, //产品名称
        brandName: brandName, //品牌
        shelfLifeUnit: shelfLifeUnit, //保质期单位
        shelfLife: shelfLife, //保质期
        packageList: packageList,
        extAttrList: extAttrList // 拓展属性
      };
      let productList = [];
      productList.push(product);
      let biz_content = {
        productList: productList,
        isCover: 1 //值为0不覆盖,不传或其他值为覆盖(int)
      };
      let method = "product";
      //请求参数
      let requestParam = {
        method: method,
        biz_content: biz_content
      };
      // 调用公共方法向易溯发数据
      let func1 = extrequire("GT101792AT1.common.sendYS");
      let res = func1.execute(null, requestParam);
      if (res.ysContent.code != "0") {
        throw new Error("Ys推送易溯错误：" + JSON.stringify(res.errMsg));
      }
    }
  }
}
exports({ entryPoint: MyTrigger });