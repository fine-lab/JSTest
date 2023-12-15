let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
let merchantClass = extrequire("GT52668AT9.CommonUtils.merchant");
let productClass = extrequire("GT52668AT9.CommonUtils.getProductInfo");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0];
    let customer = bill.customer;
    if (queryUtils.isEmpty(customer)) {
      let customer_name = param.data[0].customer_name;
      if (queryUtils.isEmpty(customer_name)) {
        throw new Error("没有录入上报节点信息！");
      }
      //客户信息
      customer = merchantClass.getMerchantId(customer_name);
      if (queryUtils.isEmpty(customer)) {
        throw new Error("没有获取到上报节点信息！");
      }
      bill.set("customer", customer);
    }
    let seller = bill.seller;
    let seller_name = bill.seller_name;
    if (queryUtils.isEmpty(seller) && !queryUtils.isEmpty(seller_name)) {
      seller = merchantClass.getMerchantId(seller_name);
      if (queryUtils.isEmpty(seller)) {
        throw new Error("没有获取到销售方信息！");
      }
      bill.set("seller", "" + seller);
    }
    let client = bill.client;
    let client_name = bill.client_name;
    if (queryUtils.isEmpty(client_name)) {
      throw new Error("没有录入客户方信息！");
    }
    if (queryUtils.isEmpty(client)) {
      client = merchantClass.getMerchantId(client_name);
      if (queryUtils.isEmpty(client)) {
        throw new Error("没有获取到客户方信息！");
      }
      bill.set("client", client);
    }
    if (customer == seller) {
      bill.set("direction", "1");
    } else if (customer == client) {
      bill.set("direction", "0");
    } else {
      throw new Error("没有设置商品流向信息！");
    }
    let saledate = bill.saledate;
    if (queryUtils.isEmpty(saledate)) {
      throw new Error("没有录入销售日期信息！");
    }
    let reportproductname = bill.reportproductname;
    if (queryUtils.isEmpty(reportproductname)) {
      throw new Error("没有录入上报产品名称信息！");
    }
    let product = bill.product;
    let productsku = bill.productsku;
    if (queryUtils.isEmpty(product)) {
      let product_name = bill.product_name;
      if (!queryUtils.isEmpty(product_name)) {
        product = productClass.getProductId(product_name);
        bill.set("product", product);
      } else {
        let sql =
          "select agentProductId.productId as productId," +
          "agentProductId.skuId as skuId " +
          "from sa.agent.AgentProductExtend t " +
          "left join agentProductId on t.agentProductId=agentProductId.id " +
          "where agentProductId.agentId='" +
          client +
          "' " +
          "and agentProductName='" +
          reportproductname +
          "' ";
        let productInfos = ObjectStore.queryByYonQL(sql, "udinghuo");
        if (!queryUtils.isEmpty(productInfos)) {
          product = productInfos[0].productId + "";
          bill.set("product", product);
          if (queryUtils.isEmpty(productsku) && !queryUtils.isEmpty(productInfos[0].skuId)) {
            productsku = productInfos[0].skuId + "";
            bill.set("productsku", productsku);
          }
        }
      }
    }
    if (queryUtils.isEmpty(productsku)) {
      let productsku_name = bill.productsku_name;
      if (!queryUtils.isEmpty(productsku_name)) {
        productsku = productClass.getProductSkuId(productsku_name);
        bill.set("productsku", productsku);
      }
    }
    let reportunit = bill.reportunit;
    if (queryUtils.isEmpty(reportunit)) {
      let reportunit_name = bill.reportunit_name;
      if (queryUtils.isEmpty(reportunit_name)) {
        throw new Error("没有录入上报单位信息！");
      }
      reportunit = productClass.getProductUnitId(reportunit_name);
      if (queryUtils.isEmpty(reportunit)) {
        throw new Error("没有获取到上报单位信息！");
      }
      bill.set("reportunit", reportunit);
    }
    let reportqty = bill.reportqty;
    if (queryUtils.isEmpty(reportqty)) {
      throw new Error("没有录入上报数量信息！");
    }
    let productUnit = null;
    if (!queryUtils.isEmpty(product)) {
      productUnit = productClass.getProductUnit(product);
      saledate = queryUtils.getDateString(saledate);
      let sql =
        "select merchant,staff " +
        " from GT52668AT9.GT52668AT9.salesman_goods where product=" +
        product +
        " and (merchant=" +
        client +
        " or merchant is null) " +
        " and startDate<='" +
        saledate +
        "' and (endDate >='" +
        saledate +
        "' or endDate is null) order by merchant desc";
      let staffInfo = ObjectStore.queryByYonQL(sql);
      if (!queryUtils.isEmpty(staffInfo)) {
        bill.set("operator", staffInfo[0].staff + "");
      }
    }
    if (!queryUtils.isEmpty(productUnit)) {
      let unit = productUnit[0].unit;
      let reportexchrate = null;
      if (reportunit == unit) {
        reportexchrate = 1;
      } else {
        let assistUnitExchange = productUnit[0].assistUnitExchange;
        if (queryUtils.isEmpty(assistUnitExchange)) {
          throw new Error("上报单位不在物料计量单位范围内！");
        }
        for (let i = 0; i < assistUnitExchange.length; i++) {
          let assistUnit = assistUnitExchange[i].assistUnit;
          if (reportunit == assistUnit) {
            reportexchrate = assistUnitExchange[i].mainUnitCount;
            break;
          }
        }
        if (queryUtils.isEmpty(reportexchrate)) {
          throw new Error("上报单位不在物料计量单位范围内！");
        }
      }
      bill.set("unit", unit + "");
      bill.set("reportexchrate", reportexchrate + "");
      let qty = reportqty * reportexchrate;
      bill.set("qty", qty + "");
      bill.set("saleunit", productUnit[0].batchUnit.assistUnit + "");
      let invexchrate = productUnit[0].batchUnit.mainUnitCount;
      bill.set("invexchrate", invexchrate + "");
      let saleqty = MoneyFormatReturnBd(qty / invexchrate, 3);
      bill.set("saleqty", saleqty + "");
    }
    let reportmoney = bill.reportmoney;
    if (queryUtils.isEmpty(reportmoney)) {
      let reportprice = bill.reportprice;
      if (!queryUtils.isEmpty(reportprice)) {
        reportmoney = reportqty * reportprice;
        bill.set("reportmoney", reportmoney + "");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });