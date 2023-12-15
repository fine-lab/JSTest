let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var day = date.getDate();
    var dateStr = [year, "-", month, "-", day].join("");
    var custId = request.custId;
    var orgId = request.orgId;
    var productClassId = request.productClassID;
    var productClassIDOne = request.productClassIDOne;
    var productClassIDTwo = request.productClassIDTwo;
    var productCode = request.productCode;
    var sql =
      "select c.agentId agentId,c.productId productId,a.price price,d.name amountUnit , d.id  amountUnitid   " +
      "from marketing.price.PriceRecord " +
      "inner join marketing.price.PriceAdjustDetail a on a.id = priceAdjustmentItemId " +
      "inner join marketing.price.PriceTemplate b on b.id = priceTemplateId " +
      "inner join marketing.price.PriceAdjustDetailDimension c on c.priceAdjustDetailId = a.id " +
      "left join pc.unit.Unit d on amountUnit = d.id " +
      "where   orgScope = '" +
      orgId +
      "' and  enable = 1 and adddate(beginDate,0)  <=  '" +
      dateStr +
      "' and  adddate(endDate,0)  >=  '" +
      dateStr +
      "' and b.name = '客户+商品'   ";
    if (custId != null && custId != "") {
      sql += " and c.agentId = '" + custId + "'";
    }
    let listMap = {};
    var list = ObjectStore.queryByYonQL(sql, "marketingbill");
    for (var z = 0; z < list.length; z++) {
      listMap[list[z].productId] = list[z];
    }
    let Productsql =
      "select id,name,productClass,orgId,code,a.imgName imgName,a.folder folder,b.name skuname,b.id skuid,c.name unit1,f.name wa ,f.id waid, c.id unitid1 , ifnull(productCharacterDef.basenum,0) numbei " +
      ",ii.ustatus , jj.assistUnitCount  assistUnitCount , jj.mainUnitCount mainUnitCount,jj.assistUnit assistUnitid , d.batchPriceUnit pfjjdw, d.batchUnit pfxsdw from pc.product.Product " +
      "left join pc.product.ProductAlbum a on id = a.productId " +
      "left join pc.product.ProductSKU b on defaultSKUId = b.id " +
      "left join pc.unit.Unit c on unit = c.id " +
      "left join pc.product.ProductDetail d on id = d.productId " +
      "left join pc.unit.Unit f on d.batchUnit = f.id " +
      " inner  join  pc.product.ProductAssistClass pclass on pclass.productId =  id " +
      " inner  join  pc.cls.PresentationClass pclass2 on pclass2.id =  pclass.productClassId " +
      "left join pc.product.ProductFreeDefine bb on bb.id = id " +
      "inner join pc.product.ProductApplyRange h on h.productId = id " +
      "left join pc.product.ProductAssistUnitExchange jj on id = jj.productId " +
      "inner join pc.product.ProductSkuDetailNew ii on ii.productId = id ";
    Productsql += " where (a.sort = 1  or a.sort = null) and  ii.ustatus='true' and h.orgId = '" + orgId + "'";
    if (productCode != null && productCode != "") {
      Productsql += " and  ( code like '" + productCode + "'  or  name like '" + productCode + "' ) ";
    } else {
      if (productClassId != null && productClassId != "") {
        Productsql += "  and  pclass2.id = '" + productClassId + "'    ";
      } else if (productClassIDTwo != null && productClassIDTwo != "") {
        Productsql += " and  pclass2.secondLevel ='" + productClassIDTwo + "' ";
      } else if (productClassIDOne != null && productClassIDOne != "") {
        Productsql += " and  pclass2.firstLevel ='" + productClassIDOne + "'   ";
      }
    }
    let body = {
      pageIndex: 1,
      pageSize: 200,
      manageClass: "1466112315187789827",
      simple: { "detail.stopstatus": false }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GZTBDM", JSON.stringify(body));
    let resdataMap = {};
    let resdata = JSON.parse(apiResponse);
    if (resdata != null && resdata.code == "200") {
      let data = resdata.data.recordList;
      for (var w = 0; w < data.length; w++) {
        if (data[w].url != null && data[w].url != "") {
          resdataMap[data[w].code] = data[w].url;
        }
      }
    }
    Productsql += "  order  by code ";
    var Productres = ObjectStore.queryByYonQL(Productsql, "productcenter");
    var Merchantsql = "select id,name from aa.merchant.Merchant";
    var Merchantres = ObjectStore.queryByYonQL(Merchantsql, "productcenter");
    let MerchantresMap = {};
    for (var z = 0; z < Merchantres.length; z++) {
      MerchantresMap[Merchantres[z].id] = Merchantres[z];
    }
    var PresentationClasssql =
      "select productId, group_concat(b.name) as name  from pc.product.ProductAssistClass  inner join pc.cls.PresentationClass b on b.id =  productClassId  group  by  productId";
    var PresentationClassres = ObjectStore.queryByYonQL(PresentationClasssql, "productcenter");
    let PresentationClassresMap = {};
    for (var z = 0; z < PresentationClassres.length; z++) {
      PresentationClassresMap[PresentationClassres[z].productId] = PresentationClassres[z];
    }
    let productMap = {};
    var res = [];
    var i = 0;
    for (var j = 0; j < Productres.length; j++) {
      var productres = Productres[j].id;
      var aaa = listMap[productres] == null;
      if (listMap[productres] == null || listMap[productres] == "") {
        continue;
      } else {
        // 一个物料对应多个类型 ，判断这个物料是否已经添加到返回数据中
        if (productMap[productres] == null || productMap[productres] == "") {
          productMap[productres] = productres;
        } else {
          continue;
        }
        let map = {};
        var priceObj = listMap[productres];
        var code = Productres[j].code;
        var aa = resdataMap[code];
        if (aa != null && aa != "") {
          map["url"] = aa;
        }
        map["productName"] = Productres[j].name;
        map["productClassID"] = Productres[j].productClass;
        map["orgId"] = Productres[j].orgId;
        map["imgName"] = Productres[j].imgName;
        map["folder"] = Productres[j].folder;
        map["code"] = Productres[j].code;
        map["skuname"] = Productres[j].skuname;
        map["skuid"] = Productres[j].skuid;
        map["productId"] = Productres[j].id;
        map["zunit"] = Productres[j].unit1;
        map["pfunit"] = Productres[j].wa;
        map["zunitid"] = Productres[j].unitid1;
        map["pfunitid"] = Productres[j].waid;
        map["numbei"] = Productres[j].numbei;
        map["agentId"] = priceObj.agentId;
        map["productId"] = priceObj.productId;
        map["price"] = priceObj.price;
        map["amountUnitid"] = priceObj.amountUnitid;
        map["amountUnit"] = priceObj.amountUnit;
        map["assistUnitCount"] = Productres[j].assistUnitCount;
        map["mainUnitCount"] = Productres[j].mainUnitCount;
        map["pfjjdw"] = Productres[j].pfjjdw;
        map["pfxsdw"] = Productres[j].pfxsdw;
        map["assistUnitid"] = Productres[j].assistUnitid;
        if (MerchantresMap[priceObj.agentId] != null && MerchantresMap[priceObj.agentId] != "") {
          map["agentName"] = MerchantresMap[priceObj.agentId].name;
          map["agentId"] = priceObj.agentId;
        }
        if (PresentationClassresMap[productres] != null && PresentationClassresMap[productres] != "") {
          map["PresentationClass"] = PresentationClassresMap[productres].name;
        }
        res[i] = map;
        i++;
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });