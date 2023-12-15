let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let carriers = request.carriers; //承运商驾驶员信息
    let apiResponseVendorList = extrequire("GT22176AT10.backDefaultGroup.getCrrierDriverInfo").execute(carriers);
    let carrierRes = apiResponseVendorList.carrierRes;
    let sccessInfo = [];
    let carLicNum = [];
    let carNum = [];
    for (let l = 0; l < carriers.length; l++) {
      carLicNum.push(carriers[l].dirverIdCode);
    }
    for (let l = 0; l < carrierRes.length; l++) {
      carNum.push(carrierRes[l].dirver_id_code);
    }
    //取两个数组的交集
    let arr3;
    arr3 = carLicNum.filter(function (num) {
      return carNum.indexOf(num) !== -1;
    });
    if (carriers.length > 0) {
      for (let l = 0; l < arr3.length; l++) {
        var id;
        for (let carId = 0; carId < carrierRes.length; carId++) {
          if (arr3[l] == carrierRes[carId].dirver_id_code) {
            id = carrierRes[carId].id;
            break;
          }
        }
        for (let d = 0; d < carriers.length; d++) {
          if (arr3[l] == carriers[d].dirverIdCode) {
            let crrierObject = {
              id: id, //ID
              org_id: carriers[d].orgId, //使用组织ID
              org_id_name: carriers[d].orgName, //使用组织名称
              belong_crrier: carriers[d].carrierId, //所属承运商ID
              belong_crrier_name: carriers[d].carrierName, //所属承运商名称
              belong_crrier_code: carriers[d].carrierCode, //所属承运商编码
              driver_name: carriers[d].driverName, //驾驶员名称
              dirver_id_code: carriers[d].dirverIdCode, //驾驶员身份证
              driving_license: carriers[d].drivingLicense, //驾驶证号码
              license_end_date: carriers[d].licenseEndDate, //证照有效期至
              is_default: carriers[d].isDefault, //是否默认
              remark: carriers[d].remark //备注;
            };
            let res = ObjectStore.updateById("GT22176AT10.GT22176AT10.carrier_driver_info", crrierObject, "carrier_driver_info");
            sccessInfo.push("驾驶员信息修改保存成功");
          }
        }
      }
    }
    //取两个数组的差集
    let diffArr;
    diffArr = carLicNum.filter(function (num) {
      return carNum.indexOf(num) == -1;
    });
    if (diffArr.length > 0 && diffArr !== null) {
      for (let d = 0; d < carriers.length; d++) {
        for (let l = 0; l < diffArr.length; l++) {
          if (diffArr[l] == carriers[d].dirverIdCode) {
            let crrierObject = {
              org_id: carriers[d].orgId, //使用组织ID
              org_id_name: carriers[d].orgName, //使用组织名称
              belong_crrier: carriers[d].carrierId, //所属承运商ID
              belong_crrier_name: carriers[d].carrierName, //所属承运商名称
              belong_crrier_code: carriers[d].carrierCode, //所属承运商编码
              driver_name: carriers[d].driverName, //驾驶员名称
              dirver_id_code: carriers[d].dirverIdCode, //驾驶员身份证
              driving_license: carriers[d].drivingLicense, //驾驶证号码
              license_end_date: carriers[d].licenseEndDate, //证照有效期至
              is_default: carriers[d].isDefault, //是否默认
              remark: carriers[d].remark //备注;
            };
            let crrierRes = ObjectStore.insert("GT22176AT10.GT22176AT10.carrier_driver_info", crrierObject, "carrier_driver_info");
            sccessInfo.push("驾驶员信息新增保存成功");
          }
        }
      }
    }
    return { sccessInfo };
  }
}
exports({ entryPoint: MyAPIHandler });