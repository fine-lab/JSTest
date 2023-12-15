let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var data = param.data[0];
    var orderDetails = data.materialdemand_2230760591495424;
    var temp = new Array();
    //声明4个数组，分别代表需汇总的表头和3个表体，后期该数组就会变成JSON数组
    var HeadArray = new Array(); //表头
    var materialClassifySumArray = new Array(); //表体1：物料分类汇总
    var deptSumArray = new Array(); //表体2：部门汇总
    var demandPlanDetailArray = new Array(); //表体3:需求计划明细
    orderDetails.forEach((dataod) => {
      if (dataod._selected == true) {
        //调用yonsql，取得表体字段
        let sql = "select * from GT21859AT11.GT21859AT11.ceshi002 where ceshi002Fk =" + dataod.id;
        var dataLine = ObjectStore.queryByYonQL(sql)[0]; //这个dataLine就是表体字段
        temp.push(dataod.id);
        debugger;
        //选中多少个表，数组中就会记录子表1（物料分类汇总）多少条数据
        let materialClassifySumJSON = {}; //声明一个临时的空JSON对象，用来中转数据
        materialClassifySumJSON.materialClassify = dataLine.wuliaofenlei; //在json对象中添加键值对数据
        materialClassifySumArray.push(materialClassifySumJSON); //将json数据填入数组
        //选中多少个表，数组中就会记录子表2（部门汇总）多少条数据
        let deptSumJSON = {}; //声明一个临时的空JSON对象，用来中转数据
        deptSumJSON.dept = dataLine.dept; //在json对象中添加键值对数据
        deptSumArray.push(deptSumJSON); //将json数据填入数组
        //选中多少个表，数组中就会记录子表3（需求计划明细）多少条数据
        let demandPlanDetailJSON = {}; //声明一个临时的空JSON对象，用来中转数据
        demandPlanDetailJSON.materialNo = dataLine.wuliaobianma; //物料编码
        demandPlanDetailJSON.materialName = dataLine.wuliaomingchen; //物料名称
        demandPlanDetailJSON.materialClassify = dataLine.wuliaofenlei; //物料分类
        demandPlanDetailJSON.type = dataLine.guigexinghao; //规格型号
        demandPlanDetailJSON.logo = dataLine.pinpai; //品牌
        demandPlanDetailJSON.materialDesc = dataLine.wuliaomiaoshu; //物料描述
        demandPlanDetailJSON.unit = dataLine.danwei; //单位
        demandPlanDetailJSON.planPrice = dataLine.jihuadanjia; //计划单价
        demandPlanDetailJSON.demandAmount = dataLine.xuqiushuliang; //需求数量
        demandPlanDetailJSON.planMoney = dataLine.jihuajine; //计划金额
        demandPlanDetailJSON.demandTime = dataLine.xuqiushijian; //需求时间
        demandPlanDetailJSON.usage = dataLine.yongtu; //用途
        demandPlanDetailJSON.transRegion = dataLine.songhuodizhi; //送货区域
        demandPlanDetailJSON.receiverTel = dataLine.shouhuodianhua; //收货人电话
        demandPlanDetailJSON.demandDep = dataLine.dept; //需求部门
        demandPlanDetailJSON.stockAmount = dataLine.xiancunliang; //现存量
        demandPlanDetailJSON.highestPrice = dataLine.zuigaojia; //最高价
        demandPlanDetailJSON.lowestPrice = dataLine.zuidijia; //最低价
        demandPlanDetailJSON.lastTimePrice = dataLine.zuijinyicicaigoujiage; //最近一次采购价
        demandPlanDetailJSON.budgMoney = dataLine.yusuanjine; //预算金额
        demandPlanDetailJSON.projectNo = dataLine.gongchengbianhao; //工程编号
        demandPlanDetailJSON.projectName = dataLine.gongchengmingchen; //工程名称
        demandPlanDetailJSON.wholeProject = dataLine.zhengdanxiangmu; //整单项目
        demandPlanDetailJSON.replaceNo = dataLine.beijianhao; //备件号
        demandPlanDetailJSON.urgentFlag = dataLine.jiajibiaozhi; //加急标志
        demandPlanDetailJSON.enclosure = dataLine.fujian; //附件
        demandPlanDetailJSON.pingBiaoYuan = dataLine.pingbiaoyuan; //评标员
        demandPlanDetailJSON.supplier = dataLine.gongyingshang; //供应商
        demandPlanDetailJSON.purchaseMethod = dataLine.caigoufangshi; //采购方式
        demandPlanDetailJSON.planRegion = dataLine.plansource; //计划来源
        demandPlanDetailJSON.keyMaterial = dataLine.zhongdianwuli; //重点物资
        demandPlanDetailJSON.reportFlag = dataLine.shangbaobiaoshi; //上报标识
        demandPlanDetailJSON.sumFlag = dataLine.huizongbiaoshi; //汇总标识
        demandPlanDetailArray.push(demandPlanDetailJSON); //将json数据填入数组
        var isno = dataod.shangbaobiaoshi;
      }
    });
    var object = [{ remark: "test", materialClassifySumList: materialClassifySumArray, deptSumList: deptSumArray, demandPlanDetailList: demandPlanDetailArray }];
    var res = ObjectStore.insertBatch("GT21859AT11.GT21859AT11.MaterialDemandSum", object);
    throw new Error("已经将id为" + temp + "的【物资需求单】插入了【待汇总需求计划列表】实体");
    return {};
  }
}
exports({ entryPoint: MyTrigger });