let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //查询养护类别
    //获取商品档案
    let menchantQueryPageUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/queryByPage";
    let bodyPage = {
      condition: {
        simpleVOs: [
          {
            conditions: [
              {
                op: "eq",
                field: "extend_syzt",
                value1: "1"
              }
            ]
          }
        ]
      },
      page: {
        pageIndex: 1,
        pageSize: 1000000
      }
    };
    let apiResponseProduct = openLinker("POST", menchantQueryPageUrl, apiPreAndAppCode.appCode, JSON.stringify(bodyPage));
    apiResponseProduct = JSON.parse(apiResponseProduct);
    let materialProInfo = apiResponseProduct.data.recordList;
    var proId = [];
    for (let pro = 0; pro < materialProInfo.length; pro++) {
      proId.push(materialProInfo[pro].id);
    }
    var merchantQtyInfo = [];
    for (let pId = 0; pId < proId.length; pId++) {
      //现存量查询
      let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition?product=" + proId[pId];
      let apiQtyResponse = openLinker("POST", menchantQueryUrl, apiPreAndAppCode.appCode, null);
      apiQtyResponse = JSON.parse(apiQtyResponse);
      merchantQtyInfo = apiQtyResponse.data;
    }
    var batchNo = [];
    for (let batch = 0; batch < merchantQtyInfo.length; batch++) {
      batchNo.push(merchantQtyInfo[batch].batchno);
    }
    var batchNoInfo = [];
    for (let bn = 0; bn < batchNo.length; bn++) {
      if (batchNo[bn] != null && batchNo[bn] != "null") {
        let batchNoUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/batchno/report/list";
        let Body = {
          pageIndex: "1",
          pageSize: "100000000",
          batchno: batchNo[bn]
        };
        let apiResponseBatch = openLinker("POST", batchNoUrl, apiPreAndAppCode.appCode, JSON.stringify(Body));
        apiResponseBatch = JSON.parse(apiResponseBatch);
        let data = apiResponseBatch.data;
        batchNoInfo.push(apiResponseBatch.data.recordList);
      }
    }
    var proData = [];
    let map = {};
    for (let i = 0; i < merchantQtyInfo.length; i++) {
      for (let j = 0; j < batchNoInfo.length; j++) {
        for (let k = 0; k < batchNoInfo[j].length; k++) {
          if (merchantQtyInfo[i].product == batchNoInfo[j][k].product && merchantQtyInfo[i].batchno == batchNoInfo[j][k].batchno) {
            let materialId = merchantQtyInfo[i].product;
            let vendorList = { materialId };
            //获取商品档案详情
            let apiResponseProduct = extrequire("GT22176AT10.publicFunction.getProductDetail").execute(vendorList);
            let materialProDetail = apiResponseProduct.merchantInfo;
            let batch = batchNoInfo[j][k];
            let firstDate = materialProDetail.extend_syrq_date;
            if (typeof firstDate != "undefined") {
              let firstStartDate = new Date(firstDate);
              let nowDate = new Date(); //时间差的毫秒数
              let s1 = firstStartDate.getTime(),
                s2 = nowDate.getTime();
              let time_diff = (s2 - s1) / 1000;
              //计算出相差天数
              let days = parseInt(time_diff / (24 * 60 * 60));
              if (days > 90 && days < 365) {
                let data = {
                  org_id: materialProDetail.productApplyRange.orgId,
                  org_id_name: materialProDetail.productApplyRange_OrgId_Name
                };
                let childData = {
                  product_code: materialProDetail.id,
                  product_code_code: materialProDetail.code,
                  product_name: materialProDetail.name,
                  lot_number: merchantQtyInfo[i].batchno,
                  product_unit: materialProDetail.unit,
                  product_unit_name: materialProDetail.unit_Name,
                  product_num: merchantQtyInfo[i].currentqty,
                  specification: merchantQtyInfo[i].modelDescription,
                  produc_name: materialProDetail.extend_tym,
                  dosage_form: materialProDetail.extend_jx,
                  dosage_form_dosagaFormName: materialProDetail.extend_jx_dosagaFormName,
                  manufacturer: materialProDetail.manufacturer,
                  origin_place: materialProDetail.placeOfOrigin,
                  approval_number: materialProDetail.extend_pzwh,
                  license_holder: materialProDetail.extend_ssxkcyr,
                  license_holder_ip_name: materialProDetail.extend_ssxkcyr_ip_name
                };
                proData.push(data, childData);
              }
            }
          }
        }
      }
    }
    return { proData };
  }
}
exports({ entryPoint: MyAPIHandler });