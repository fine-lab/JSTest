let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取安装合同号
    var contractno = param.return.installationContractNo_contractno;
    // 获取生产工号
    var productionJobNumber = param.return.productionJobNumber_Productionworknumber;
    // 获取现场图片与视频上传时间
    var uploadPicturesAndVideos = param.return.uploadPicturesAndVideos;
    // 获取建立监理微信群上传时间
    var uploadWeChatGroup = param.return.uploadWeChatGroup;
    // 获取一次地盘检查报告上传时间
    var uploadInspectionReport = param.return.uploadInspectionReport;
    // 获取温馨提示上传时间
    var uploadReminder = param.return.uploadReminder;
    // 获取报装资料提示上传时间
    var uploadInformationPrompt = param.return.uploadInformationPrompt;
    // 根据安装合同号查询安装合同表
    var installSql = "select * from GT102917AT3.GT102917AT3.basicinformation where contractno = '" + contractno + "'";
    var installSqlResult = ObjectStore.queryByYonQL(installSql, "developplatform");
    // 安装合同号唯一，所以只会查出一条数据，所以默认去第一条数据即可
    // 获取安装合同主表的Id;
    var masterId = installSqlResult[0].id;
    // 根据主表主键、生产工号查询安装合同子表信息
    var installSonSql = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" + productionJobNumber + "' and BasicInformationDetailsFk = '" + masterId + "'";
    var installSonSqlResult = ObjectStore.queryByYonQL(installSonSql, "developplatform");
    // 根据主表主键、生产工号查询安装合同子表信息查询出来数据唯一;取子表的主键
    var sonId = installSonSqlResult[0].id;
    // 根据子表的主键，查询孙表【施工前1】
    var installSunSql = "select * from GT102917AT3.GT102917AT3.Beforetheconstruction where BasicInformationDetails_id = '" + sonId + "'";
    var installSunSqlResult = ObjectStore.queryByYonQL(installSunSql, "developplatform");
    // 获取孙表【施工前1】Id
    var sunId = installSunSqlResult[0].id;
    var object = {
      id: masterId,
      _status: "Update",
      BasicInformationDetailsList: [
        {
          id: sonId,
          _status: "Update",
          BeforetheconstructionList: [
            {
              id: sunId,
              xianchangjianchazhaopian: uploadPicturesAndVideos,
              jianliweixinqun: uploadWeChatGroup,
              yicidipanjianchabaogao: uploadInspectionReport,
              wenxintishi: uploadReminder,
              baozhuangziliaotishi: uploadInformationPrompt,
              _status: "Update"
            }
          ]
        }
      ]
    };
    throw new Error(JSON.stringify(object));
    var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.basicinformation", object, "179f2f7c");
    return { res };
  }
}
exports({ entryPoint: MyTrigger });