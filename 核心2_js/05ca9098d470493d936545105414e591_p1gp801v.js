let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var escid = request.escid;
    var esc_applicant = request.esc_applicant;
    var esc_microServiceName = request.esc_microServiceName;
    var esc_microServiceCode = request.esc_microServiceCode;
    var esc_source = request.esc_source;
    var esc_productLine = request.esc_productLine;
    var esc_domainCloud = request.esc_domainCloud;
    var esc_industryName = request.esc_industryName;
    var esc_microserviceGroupName = request.esc_microserviceGroupName;
    var esc_microserviceGroupCode = request.esc_microserviceGroupCode;
    var esc_microserviceInfo = request.esc_microserviceInfo;
    var esc_isvCode = request.esc_isvCode;
    var esc_isvName = request.esc_isvName;
    var esc_appServiceName = request.esc_appServiceName;
    var esc_appServiceCode = request.esc_appServiceCode;
    var esc_serviceCommanderName = request.esc_serviceCommanderName;
    var esc_commanderPhone = request.esc_commanderPhone;
    var esc_commanderdepartment = request.esc_commanderdepartment;
    var esc_applicantName = request.esc_applicantName;
    var esc_applicantEmail = request.esc_applicantEmail;
    var esc_applicantPhone = request.esc_applicantPhone;
    var userid = request.userid;
    var ytenant_id = request.ytenant_id;
    var esc_extendedEncoding = request.esc_extendedEncoding;
    var esc_deploymentMethod = request.esc_deploymentMethod;
    var esc_domainCloudCode = request.esc_domainCloudCode;
    var escAppServiceNameEn = request.escAppServiceNameEn;
    var escDomain = request.escDomain;
    var object = {
      escid: escid,
      esc_applicant: esc_applicant,
      esc_microServiceName: esc_microServiceName,
      esc_microServiceCode: esc_microServiceCode,
      esc_source: esc_source,
      esc_productLine: esc_productLine,
      esc_domainCloud: esc_domainCloud,
      esc_industryName: esc_industryName,
      esc_microserviceGroupName: esc_microserviceGroupName,
      esc_microserviceGroupCode: esc_microserviceGroupCode,
      esc_microserviceInfo: esc_microserviceInfo,
      esc_isvCode: esc_isvCode,
      esc_isvName: esc_isvName,
      esc_appServiceName: esc_appServiceName,
      esc_appServiceCode: esc_appServiceCode,
      esc_serviceCommanderName: esc_serviceCommanderName,
      esc_commanderPhone: esc_commanderPhone,
      esc_commanderdepartment: esc_commanderdepartment,
      esc_applicantName: esc_applicantName,
      esc_applicantEmail: esc_applicantEmail,
      esc_applicantPhone: esc_applicantPhone,
      userid: userid,
      ytenant_id: ytenant_id,
      esc_extendedEncoding: esc_extendedEncoding,
      esc_deploymentMethod: esc_deploymentMethod,
      esc_domainCloudCode: esc_domainCloudCode,
      escAppServiceNameEn: escAppServiceNameEn,
      escDomain: escDomain
    };
    var res = ObjectStore.insert("AT1740DE240888000B.AT1740DE240888000B.ecologicalservicecode", object, "ybe1ce2b59");
    var jsonObj = JSON.parse(JSON.stringify(res));
    let obj = { id: jsonObj.id };
    let detail = ObjectStore.selectById("AT1740DE240888000B.AT1740DE240888000B.ecologicalservicecode", obj);
    let data = { billnum: "ybe1ce2b59", data: JSON.stringify(detail) };
    let resSub = ObjectStore.execute("submit", data);
    // 将应用构建的数据ID传回服务
    var objSelect = { escid: escid };
    var resSelect = ObjectStore.selectByMap("AT1740DE240888000B.AT1740DE240888000B.ecologicalservicecode", objSelect);
    let body = { escId: escid, appId: resSelect[0].id };
    let header = {};
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { resSub };
  }
}
exports({ entryPoint: MyAPIHandler });