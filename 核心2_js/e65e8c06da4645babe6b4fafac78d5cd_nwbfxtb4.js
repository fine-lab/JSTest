let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //库存查询根据物料编码查询
    //获取租户所在数据中心域名
    let hqym = "https://www.example.com/";
    let apiResponse = openLinker("GET", hqym, "GT6363AT15", JSON.stringify({}));
    let result = JSON.parse(apiResponse);
    //调用接口
    let url = result.data.gatewayUrl + "/yonbip/digitalModel/product/queryByPage";
    //获取前端函数数据
    let data1 = request.data;
    let id;
    let aa;
    let aaa;
    let product_code;
    let shangpinmingchen;
    let product;
    //循环物料编码
    for (let j = 0; j < data1.length; j++) {
      let value = data1[j];
      var wuliao = "select * from pc.product.Product where code  = '" + value.jingdongsku + "'";
      var reswuliao = ObjectStore.queryByYonQL(wuliao, "productcenter");
      id = value.id;
      //物料
      product = reswuliao[0].id;
      product_code = reswuliao[0].code;
      shangpinmingchen = reswuliao[0].name;
      var wuliao2 = "select * from pc.product.Product where id  = '" + product + "'";
      var reswuliao2 = ObjectStore.queryByYonQL(wuliao2, "productcenter");
      var wuliaoxq = "select * from  pc.product.ProductDetail where productId  = '" + product + "'";
      var reswuliaoxq = ObjectStore.queryByYonQL(wuliaoxq, "productcenter");
      var wuliaozdy = "select * from  pc.product.ProductFreeDefine where id  = '" + product + "'";
      var reswuliaozdy = ObjectStore.queryByYonQL(wuliaozdy, "productcenter");
      var shuilv = "select * from  bd.taxrate.TaxRateVO where id  = '" + reswuliaoxq[0].outTaxrate + "'";
      var resshuilv = ObjectStore.queryByYonQL(shuilv, "ucfbasedoc");
      //平台上架人
      let pingtaishangjiaren = reswuliaozdy[0].define2;
      //销售组织名称
      let xiaoshouzuzhi = reswuliaozdy[0].define16;
      //销售组织编码
      let orgsql = "select * from org.func.BaseOrg where id = '" + reswuliaozdy[0].define16 + "'";
      let resorg = ObjectStore.queryByYonQL(orgsql, "ucf-org-center");
      let xiaoshouzuzhibianma = resorg[0].code;
      //开票组织
      let kaipiaozuzhi = reswuliaozdy[0].define16;
      //销售部门
      let adminOrgVO = reswuliaozdy[0].define14;
      //业绩归属部门
      let yejiguishubumen = reswuliaozdy[0].define14;
      let xiaoshouyewuyuan = reswuliaozdy[0].define15;
      let jiesuankehu = reswuliaozdy[0].define17;
      //物料分类
      let managementClass = reswuliao2[0].manageClass;
      //规格说明
      let guigeshuoming = reswuliao2[0].modelDescription;
      //销售项税率
      let ziduan25 = resshuilv[0].ntaxRate;
      //主计量
      //含税金额
      let hanshuijine = value.caigoujia * value.ziduan53;
      //金额计算无税
      let ziduan24 = hanshuijine / (1 + ziduan25 / 100);
      //税额=含税金额-无税金额
      let ziduan13 = hanshuijine - ziduan24;
      //含税单价=含税金额/数量
      let danjiahanshui = hanshuijine / value.ziduan53;
      let ziduan19 = value.ziduan53;
      let ziduan2 = value.ziduan53;
      let ziduan26 = ziduan24;
      let benbishuie = ziduan13;
      let ziduan36 = ziduan24;
      let shangpindanjia = danjiahanshui;
      let biaotibenbihanshuijine = hanshuijine;
      //默认供应商
      //标准售价
      let ziduan43 = reswuliaoxq[0].fMarkPrice;
      //物料简称
      let wuliaojianchen = reswuliaoxq[0].displayName;
      //更新实体
      var bczlobject = {
        id: id,
        kucunzuzhi: "2583009012879616",
        yejiguishubumen: yejiguishubumen,
        ziduan25: ziduan25,
        ziduan24: ziduan24,
        xiaoshouzuzhi: xiaoshouzuzhi,
        xiaoshouzuzhibianma: xiaoshouzuzhibianma,
        ziduan43: ziduan43,
        kaipiaozuzhi: kaipiaozuzhi,
        xiaoshouyewuyuan: xiaoshouyewuyuan,
        adminOrgVO: adminOrgVO,
        pingtaishangjiaren: pingtaishangjiaren,
        product: product,
        ziduan13: ziduan13,
        hanshuijine: hanshuijine,
        shangpinmingchen: shangpinmingchen,
        managementClass: managementClass,
        guigeshuoming: guigeshuoming, //ziduan18:ziduan18,
        jiesuankehu: jiesuankehu,
        danjiahanshui: danjiahanshui,
        ziduan19: ziduan19,
        ziduan2: ziduan2,
        ziduan26: ziduan26,
        benbishuie: benbishuie,
        ziduan36: ziduan36,
        shangpindanjia: shangpindanjia,
        biaotibenbihanshuijine: biaotibenbihanshuijine,
        product_code: product_code,
        wuliaojianchen: wuliaojianchen, //xinghao:xinghao,
        xiaoshouyewuleixing: "自然流量",
        _status: "Update"
      };
      var bczlres = ObjectStore.updateById("GT6363AT15.GT6363AT15.XS001", bczlobject, "yb2a4ceb8d");
    }
    return { bczlres };
  }
}
exports({ entryPoint: MyAPIHandler });