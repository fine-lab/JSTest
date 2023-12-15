let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const district = "select * from  GT1913AT11.GT1913AT11.XSFFRY2_District where tenant_id = 'youridHere'";
    const districtRes = ObjectStore.queryByYonQL(district);
    const product = "select * from  GT1913AT11.GT1913AT11.XSFFRY2_productlineName where tenant_id = 'youridHere'";
    const productRes = ObjectStore.queryByYonQL(product);
    // 地址档案的参照
    const districtAll = "select * from aa.regioncorp.RegionCorp";
    const districtAllRes = ObjectStore.queryByYonQL(districtAll, "productcenter");
    // 产品线的参照
    const productline = "select * from pc.productline.ProductLine";
    const productLineRes = ObjectStore.queryByYonQL(productline, "productcenter");
    const xsData = "select * from GT1913AT11.GT1913AT11.XSFFRY2 where tenant_id = 'youridHere'";
    const xsDataRes = ObjectStore.queryByYonQL(xsData);
    // 换成对象，更易于取值
    let districtMap = {};
    districtAllRes.forEach((item) => {
      districtMap[item.id] = item.name;
    });
    let productLineMap = {};
    productLineRes.forEach((item) => {
      productLineMap[item.id] = item.name;
    });
    districtRes.forEach((item) => (item.name = districtMap[item.District]));
    productRes.forEach((item) => (item.name = productLineMap[item.productlineName]));
    xsDataRes.forEach((item) => {
      let arr = [];
      let productArr = [];
      districtRes.forEach((info) => {
        if (item.id === info.fkid) {
          arr.push(info.name);
        }
      });
      productRes.forEach((info) => {
        if (item.id == info.fkid) {
          productArr.push(info.name);
        }
      });
      item.districtList = arr;
      item.productlineNameList = productArr;
    });
    const resObj = xsDataRes.map((item) => {
      return {
        stuffNo: item.stuffNo,
        stuffName2: item.stuffName2,
        stuffId: item.stuffName,
        CCAccount: item.CCAccount,
        DeptCode: item.DeptCode,
        DeptName: item.DeptName,
        OrgCode: item.OrgCode,
        servicesOrg: item.servicesOrg,
        IsValid: item.IsValid,
        districtList: item.districtList,
        productlineNameList: item.productlineNameList
      };
    });
    return {
      data: resObj
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});