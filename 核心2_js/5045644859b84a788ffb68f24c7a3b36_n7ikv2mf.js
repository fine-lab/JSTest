let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let token_url = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var tr = JSON.parse(tokenResponse);
    var result = {};
    if (tr.code == "200") {
      let contacts = [];
      //函数：查询员工列表
      var queryPerson = function (mobile, email) {
        let psnBody = {
          mobile: mobile,
          email: email,
          enable: 1
        };
        let personRes = openLinker("POST", "https://www.example.com/", "GT5258AT16", JSON.stringify(psnBody));
        let persons = JSON.parse(personRes);
        if (persons != null && persons.data && persons.data.recordList && persons.data.recordList.length > 0) {
          let person = persons.data.recordList[0];
          return person;
        }
        return {};
      };
      var insertPartnerList = [];
      var updatePartnerList = [];
      //遍历联系人
      for (var num = 0; num < contacts.length; num++) {
        var contact = contacts[num];
        var accountName = contact.accountName;
        var contactEmail = contact.contactEmail;
        var contactMobile = contact.contactMobile;
        var contactPerson = contact.contactPerson;
        var level = "00503"; //银牌
        if (contact.level == "铜牌") {
          level = "00504"; //铜牌
        }
        //查询伙伴档案中是否存在
        var partners = ObjectStore.selectByMap("GT5258AT16.GT5258AT16.out_partner", { partnerName: accountName });
        if (partners == null || partners.length < 1) {
          //新增的
          //根据组织名称查询组织
          let orgBody = {
            name: accountName,
            enable: 1
          };
          let orgRes = openLinker("POST", "https://www.example.com/", "GT5258AT16", JSON.stringify(orgBody));
          let orgs = JSON.parse(orgRes);
          if (orgs != null && orgs.data && orgs.data.length > 0) {
            let org = orgs.data[0];
            let psn = {};
            if (contactMobile != null && contactMobile !== "") {
              psn = queryPerson(contactMobile, "");
            }
            if ((psn.id == null || psn.id == "") && contactEmail != null && contactEmail !== "") {
              psn = queryPerson("", contactEmail);
            }
            if (psn && psn.id) {
              var partnerParam = {
                partner: org.id,
                partnerName: accountName,
                partnerLevel: level,
                enable: 1,
                partner_contactsList: [
                  {
                    contact: psn.id,
                    email: contactEmail, //psn.email,
                    yhtUserId: psn.user_id,
                    contractName: psn.name,
                    isDefault: "Y"
                  }
                ]
              };
              insertPartnerList.push(partnerParam);
            }
          }
        } else {
        }
      }
      if (insertPartnerList.length > 0) {
        ObjectStore.insertBatch("GT5258AT16.GT5258AT16.out_partner", insertPartnerList, "ba3ead66");
      }
    }
    return result;
  }
}
exports({ entryPoint: MyTrigger });