let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    try {
      let reqdatas = request.data; //请求参数
      let baseurl = "https://www.example.com/";
      let url = baseurl + "/yonbip/scm/purchaseorder/singleSave_v1";
      //对请求信息进行按照供应商分组处理
      let grupdata = [];
      let { consignmentList, code, vouchdate } = reqdatas;
      let condata = { code: code, des: [] }; //结算明细待跟新数据
      grupdata = this.groupByMultipleFields(consignmentList, ["supplier_code", "departmentcode", "salesOrgcode", "warehousecode"]); //按照供应商编码和部门编码分组,组织
      if (grupdata.length > 0) {
        grupdata.forEach((item, index) => {
          try {
            let org_code = item.data[0].salesOrgcode;
            let reqdata = {
              data: {
                resubmitCheckKey: code + index + this.formatDateTimeStr(),
                bustype_code: "005",
                currency_code: "CNY",
                department: item.data[0].departmentcode, //采购部门
                exchRate: 1,
                exchRateType: "01",
                invoiceVendor_code: item.data[0].supplier_code,
                natCurrency_code: "CNY",
                org_code: org_code,
                purchaseOrders: [],
                _status: "Insert",
                vendor_code: item.data[0].supplier_code,
                vouchdate: vouchdate
              }
            };
            let supplier_code = item.data[0].supplier_code; //供应商编码
            let sql1 =
              "select code,b.taxrate taxrate ,b.taxitems taxitems,c.code taxitemcode  from  aa.vendor.Vendor inner join  aa.vendor.VendorExtend b on id=b.vendor inner join bd.taxrate.TaxRateVO c on c.id=b.taxitems   where  code='" +
              supplier_code +
              "'";
            let supplierinfo = ObjectStore.queryByYonQL(sql1, "upu");
            let taxitems_code = "NL"; //税率
            if (supplierinfo.length > 0) {
              taxitems_code = supplierinfo[0].taxitemcode;
            }
            let groupitem = this.classifyArrayGroupBySameFieldAlpha(item.data, ["inventoryId_code"]); //相同商品合并
            groupitem.forEach((item1, index1) => {
              let sql =
                "select vbelongOrgCode,vmaterialCode,ntax,npriceNoTaxOrigin,npriceOrigin,mainUnitPrice,mainUnitPriceNoTax from aa.pricecenter.BiPriceEntity where vmaterialCode='" +
                item1.data[0].inventoryId_code +
                "' And vpurchaseErpCode='" +
                org_code +
                "' and vsupplyCode='" +
                item.data[0].supplier_code +
                "'  and enable=1  order by vpriceValidate DESC";
              let pricecenter = ObjectStore.queryByYonQL(sql, "cpu-bi-service");
              let quantity = 0;
              item1.data.forEach((item2, index2) => {
                quantity += item2.quantity;
              });
              let priceinfo = this.getprices(pricecenter, quantity, taxitems_code);
              let ders = {
                inInvoiceOrg_code: org_code,
                inOrg_code: org_code,
                invExchRate: 1,
                natMoney: priceinfo.natMoney, //本币无税金额
                natSum: priceinfo.natSum, //本币含税金额
                natTax: priceinfo.natTax, //本币税额
                natTaxUnitPrice: priceinfo.natTaxUnitPrice, //本币含税单价
                natUnitPrice: priceinfo.natUnitPrice, //本币无税单价
                oriMoney: priceinfo.oriMoney, //无税金额
                oriSum: priceinfo.oriSum, //含税金额
                oriTax: priceinfo.oriTax, //税额
                oriTaxUnitPrice: priceinfo.oriTaxUnitPrice, //含税单价
                oriUnitPrice: priceinfo.oriUnitPrice, //无税单价
                taxitems_code: priceinfo.taxitems_code, //税率
                priceQty: quantity,
                product_cCode: item1.data[0].inventoryId_code,
                priceUOM_Code: item1.data[0].unitCode,
                purUOM_Code: item1.data[0].unitCode,
                warehouse_code: item1.data[0].warehousecode,
                qty: quantity,
                subQty: quantity,
                unitExchangeTypePrice: 1,
                unitExchangeType: 1,
                invPriceExchRate: 1,
                unit_code: item1.data[0].unitCode,
                isGiftProduct: true,
                _status: "Insert"
              };
              if (quantity != 0) {
                reqdata.data.purchaseOrders.push(ders);
              } else {
                //合并后商品数量为0的
                item1.data.forEach((item3, index3) => {
                  condata.des.push({
                    id: item3.id,
                    poCode: ""
                  });
                });
              }
            });
            if (reqdata.data.purchaseOrders.length > 0) {
              let apiResponse = JSON.parse(openLinker("POST", url, "AT18623B800920000A", JSON.stringify(reqdata)));
              if (apiResponse.code == "200") {
                let code1 = apiResponse.data.code;
                item.isTrue = true; //成功标识
                //分别进行更新销售结算状态
                let grupsalesout = []; //销售出库单子表更新分组
                grupsalesout = this.classifyArrayGroupBySameFieldAlpha(item.data, "salesOutId");
                grupsalesout.forEach((sout, soutindex) => {
                  let req1 = { id: sout.key, details: [], flg: "1" };
                  sout.data.forEach((soutdata, soutsindex) => {
                    req1.details.push(soutdata.salesDeliverysId);
                    //不加入
                    if (!condata.des.find((desv) => desv.id == soutdata.id)) {
                      condata.des.push({
                        id: soutdata.id,
                        poCode: code1
                      });
                    }
                  });
                  //取消更新
                });
              } else {
                rsp.code = 500;
                rsp.msg += apiResponse.message;
                console.log("调用采购订单生成接口异常" + JSON.stringify(apiResponse));
              }
            }
            //测试数据
          } catch (ex) {
            console.log("当前处理的分组数据  =》 " + JSON.stringify(item));
            item.isTrue = false; //失败标识
            rsp.msg = ex.message;
            console.log("结算失败" + ex.message);
          }
        });
        //更新结算单标识
        let func = extrequire("AT18623B800920000A.api.updataconsign");
        func.execute(condata); //更新销售出库子表
      }
    } catch (ex) {
      rsp.code = 500;
      rsp.msg = ex.message;
    }
    return rsp;
  }
  getprices(pricecenter, num, taxitems_code) {
    let res2 = {
      natMoney: 0, //本币无税金额
      natSum: 0, //本币含税金额
      natTax: 0, //本币税额
      natTaxUnitPrice: 0, //本币含税单价
      natUnitPrice: 0, //本币无税单价
      oriMoney: 0, //无税金额
      oriSum: 0, //含税金额
      oriTax: 0, //税额
      oriTaxUnitPrice: 0, //含税单价
      oriUnitPrice: 0, //无税单价
      taxitems_code: taxitems_code //税率编码
    };
    if (pricecenter.length > 0) {
      let { ntax, npriceOrigin, npriceNoTaxOrigin } = pricecenter[0];
      res2.natTaxUnitPrice = npriceOrigin; //37.4
      res2.natUnitPrice = npriceNoTaxOrigin; //37.03
      res2.oriTaxUnitPrice = npriceOrigin; //37.4
      res2.oriUnitPrice = npriceNoTaxOrigin; //37.03
      res2.natMoney = (res2.natUnitPrice * num).toFixed(2); //74.06
      res2.natSum = (res2.natTaxUnitPrice * num).toFixed(2); //74.80
      res2.natTax = (res2.natSum - res2.natMoney).toFixed(2); //0.74
      res2.oriMoney = (res2.oriUnitPrice * num).toFixed(2);
      res2.oriSum = (res2.oriTaxUnitPrice * num).toFixed(2);
      res2.oriTax = (res2.natSum - res2.natMoney).toFixed(2);
      let sql = "select  ntaxRate,code  from bd.taxrate.TaxRateVO  where ntaxRate=" + ntax; //ntax
      let taxiinfo = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
      if (taxiinfo.length > 0) {
        res2.taxitems_code = taxiinfo[0].code;
      }
    }
    return res2;
  }
  classifyArrayGroupBySameFieldAlpha(arr, filed) {
    let temObj = {};
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (!temObj[item[filed]]) {
        temObj[item[filed]] = [item];
      } else {
        temObj[item[filed]].push(item);
      }
    }
    let resArr = [];
    Object.keys(temObj).forEach((key) => {
      resArr.push({
        key: key,
        data: temObj[key]
      });
    });
    return resArr;
  }
  // 按照多个字段分组的函数
  groupByMultipleFields(arr, fields) {
    return Object.values(
      arr.reduce(function (result, obj) {
        // 生成分组的键值
        const key = fields.map((field) => obj[field]).join("|");
        // 根据分组键值将对象添加到对应的分组中
        if (!result[key]) {
          result[key] = { key: key, data: [] };
        }
        result[key].data.push(obj);
        return result;
      }, {})
    );
  }
  // 获取时间
  formatDateTimeStr(type = 1) {
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var dateObject = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var y = dateObject.getFullYear();
    var m = dateObject.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = dateObject.getDate();
    d = d < 10 ? "0" + d : d;
    var h = dateObject.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = dateObject.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = dateObject.getSeconds();
    second = second < 10 ? "0" + second : second;
    if (type === 1) {
      // 返回年月日
      return h + ":" + minute + ":" + second;
    } else if (type === 2) {
      // 返回年月日 时分秒
      return h + "" + minute + "" + second;
    }
  }
}
exports({ entryPoint: MyAPIHandler });