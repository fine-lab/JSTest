let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let packageList = new Array();
    let productList = new Array();
    if (param.length > 0) {
      for (var i = 0; i < param.length; i++) {
        let sku = param[i];
        let extAttr = {
          tempName: "自定义属性",
          name: "SKU_ID",
          value: sku.pc_productlist_userDefine006 // 物料id
        };
        let extAttrList = [];
        extAttrList.push(extAttr);
        let barCode = "";
        if (sku.detail.barCode != undefined) {
          barCode = sku.detail.barCode;
        }
        let brand_Name = "无";
        if (sku.brand_Name != undefined) {
          brand_Name = sku.brand_Name;
        }
        let product = {
          gs1Code: barCode, // 条形码
          code: sku.pc_productlist_userDefine007, //产品代码
          name: sku.pc_productlist_userDefine009, //产品名称
          brandName: brand_Name, //品牌
          packageList: packageList,
          extAttrList: extAttrList
        };
        productList.push(product);
      }
    }
    const removeDuplicateObj = (arr) => {
      let obj = {};
      arr = arr.reduce((newArr, next) => {
        obj[next.code] ? "" : (obj[next.code] = true && newArr.push(next));
        return newArr;
      }, []);
      return arr;
    };
    productList = removeDuplicateObj(productList);
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
exports({ entryPoint: MyTrigger });