let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var kjdate = param.kjdate;
    if (!kjdate) {
      kjdate = year + "00" + month;
    }
    var querySql = "select * from GT23468AT1.GT23468AT1.gl_finservice_f203 where  kjdate = '" + kjdate + "'";
    var queryData = ObjectStore.queryByYonQL(querySql);
    //构造传输json
    var jsonStr = new Object();
    jsonStr.reportid = "youridHere";
    jsonStr.name = "服务业企业财务状况表（F203）";
    jsonStr.period = kjdate;
    jsonStr.mainColumn = [
      [
        "组织机构代码",
        "单位详细名称",
        "1-本月;固定资产原价",
        "固定资产原价;上年同期",
        "1-本月;资产总计",
        "上年同期;资产总计",
        "1-本月;负债合计",
        "负债合计;上年同期",
        "1-本月;所有者权益合计",
        "上年同期;所有者权益合计",
        "1-本月;营业收入",
        "上年同期;营业收入",
        "1-本月;净服务收入",
        "净服务收入;上年同期",
        "1-本月;营业成本",
        "上年同期;营业成本",
        "1-本月;税金及附加",
        "上年同期;税金及附加",
        "1-本月;销售费用",
        "上年同期;销售费用",
        "1-本月;管理费用",
        "管理费用;上年同期",
        "1-本月;研发费用",
        "上年同期;研发费用",
        "1-本月;财务费用",
        "财务费用;上年同期",
        "1-本月;资产减值损失",
        "上年同期;资产减值损失",
        "1-本月;信用减值损失",
        "上年同期;信用减值损失",
        "1-本月;公允价值变动收益",
        "公允价值变动收益;上年同期",
        "1-本月;资产处置收益(损失以“-”号记)",
        "上年同期;资产处置收益(损失以“-”号记)",
        "1-本月;投资收益",
        "上年同期;投资收益",
        "1-本月;净敞口套期收益",
        "净敞口套期收益;上年同期",
        "1-本月;其他收益",
        "其他收益;上年同期",
        "1-本月;营业利润",
        "上年同期;营业利润",
        "1-本月;营业外收入",
        "上年同期;营业外收入",
        "1-本月;营业外支出",
        "上年同期;营业外支出",
        "1-本月;利润总额",
        "利润总额;上年同期",
        "1-本月;所得税费用",
        "上年同期;所得税费用",
        "1-本月;应付职工薪酬",
        "上年同期;应付职工薪酬",
        "1-本月;社会保险和住房公积金;应付职工薪酬",
        "上年同期;社会保险和住房公积金;应付职工薪酬",
        "1-本月;应交增值税",
        "上年同期;应交增值税",
        "1-本月;期末用工人数",
        "期末用工人数;上年同期",
        "单位负责人",
        "统计负责人",
        "填表人",
        "填表人联系电话",
        "报出日期(年)",
        "报出日期(月)",
        "报出日期(日)",
        "期别(年)",
        "期别(月)",
        "统一社会信用代码",
        "（省增）手机号码",
        "附件1",
        "附件",
        "附件2",
        "附件3",
        "数据来源"
      ]
    ];
    jsonStr.mainData = [
      [
        "71099481-2",
        "杭州假日国际旅游有限公司",
        "",
        "",
        queryData.zichanzongji,
        "",
        queryData.fuzhaiheji,
        "",
        queryData.syzqyhj,
        queryData.syzqyhj,
        queryData.yingyeshouru,
        "",
        queryData.jingfuwushouru,
        "",
        queryData.yingyechengben,
        "",
        queryData.shuijinjifujia,
        "",
        queryData.xiaoshoufeiyong,
        "",
        queryData.guanlifeiyong,
        "",
        queryData.yanfafeiyong,
        "",
        queryData.caiwufeiyong,
        "",
        queryData.zichanjianzhisunshi,
        "",
        queryData.xinyongjianzhisunshi,
        "",
        queryData.gyjzbdsy,
        "",
        queryData.zcczsy,
        "",
        queryData.touzishouyi,
        "",
        queryData.jcktqsy,
        "",
        queryData.qitashouyi,
        "",
        queryData.yingyelirun,
        "",
        queryData.yingyewaishouru,
        "",
        queryData.yingyewaizhichu,
        "",
        queryData.lirunzonge,
        "",
        queryData.suodeshuifeiyong,
        "",
        queryData.yfzgxc,
        "",
        "",
        "",
        queryData.yjzzs,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "91330110710994812Q",
        "",
        "",
        "",
        "",
        "",
        ""
      ]
    ];
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AppCode", JSON.stringify(jsonStr));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });