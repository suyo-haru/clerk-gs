const TEMPLATE_SHEET_NAME = {
  クラスの情報: 'Template.Infomation',
  商品: 'Template.Goodies',
  予算: 'Template.Budget',
  収入: 'Template.Income',
  準備: 'Template.Preparation',
  支出: 'Template.Outgo',
};

const thisSpreadSheet = SpreadsheetApp.getActive();

/**
 * 個別クラスの情報
 * @type {[{
 *  "index": Number,
 *  "classID": String,
 *  "className": String,
 *  "pass": String,
 *  "spreadSheetUrl": String
 * }]}
 */
const classInfos = (() => {
  const sheet = thisSpreadSheet.getSheetByName('クラス');
  return sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 4)
    .getValues()
    .map((i, index) => ({
      index: index,
      classID: i[0],
      className: i[1],
      pass: i[2],
      spreadSheetUrl: i[3],
    }));
})();

global.createClassSpreadSheet = () => {
  //このスプレッドシートがあるフォルダに、新しいフォルダを作る
  const driveFolder = DriveApp.getFileById(thisSpreadSheet.getId())
    .getParents()
    .next()
    .createFolder(thisSpreadSheet.getName() + '_WORK');
  /**
   * テンプレートシートのやつ
   * @type {Object.<string, SpreadsheetApp.Sheet>}
   */
  const childSheetTemplates = (() => {
    const i = {};
    for (const templateName in TEMPLATE_SHEET_NAME) {
      i[templateName] = thisSpreadSheet.getSheetByName(TEMPLATE_SHEET_NAME[templateName]);
    }
    return i;
  })();
  const newClassInfoRangeValues = thisSpreadSheet
    .getSheetByName('クラス')
    .getRange(2, 1, thisSpreadSheet.getSheetByName('クラス').getLastRow() - 1, 4)
    .getValues();
  classInfos.forEach((i) => {
    const newSpreadSheet = SpreadsheetApp.create(String(i.classID));
    DriveApp.getFileById(newSpreadSheet.getId()).moveTo(driveFolder);
    newClassInfoRangeValues[i.index][3] = newSpreadSheet.getUrl();

    for (const templateName in childSheetTemplates) {
      childSheetTemplates[templateName].copyTo(newSpreadSheet).setName(templateName).showSheet();
      Logger.log(newSpreadSheet.getSheets().map((i) => i.getName()));
    }
    newSpreadSheet.deleteSheet(newSpreadSheet.getSheets()[0]);
    newSpreadSheet.getSheetByName('クラスの情報').getRange('B1').setValue(i.className);
  });
  thisSpreadSheet
    .getSheetByName('クラス')
    .getRange(2, 1, thisSpreadSheet.getSheetByName('クラス').getLastRow() - 1, 4)
    .setValues(newClassInfoRangeValues);
};

global.onOpen = () => {
  const ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('会計処理シート')
    .addItem('生徒用シートを作成', 'createClassSpreadSheet')
    .addToUi();
};

global.doGet = () => {
  return HtmlService.createTemplateFromFile('index.html').evaluate();
  //return ContentService.createTextOutput(HtmlService.createTemplateFromFile("layout.html").getRawContent());
};


global.uploadImage = (formEl: { imageFile: GoogleAppsScript.Base.Blob; }) => {
  const driveFolderIderator = DriveApp.getFileById(thisSpreadSheet.getId()).getParents()
  const fileBlob = formEl.imageFile;
  fileBlob.setName(Utilities.getUuid());
  if (driveFolderIderator.hasNext()){
    const driveFolder = driveFolderIderator.next()
    if (driveFolder.getFoldersByName(thisSpreadSheet.getName() + "_Image").hasNext()){
      return driveFolder.getFoldersByName(thisSpreadSheet.getName() + "_Image").next().createFile(fileBlob).getDownloadUrl();
    } else {
      const subFolder = driveFolder.createFolder(thisSpreadSheet.getName() + "_Image");
      return subFolder.createFile(fileBlob).getDownloadUrl();
    } 
  } else {
    const driveFolder = DriveApp.getFolderById("1PDewiDKoBBfqSHAslwupe3imLQTo1Zrb")
    return driveFolder.createFile(fileBlob).getDownloadUrl();
  }
};

global.hoge = () => {
  Logger.log(classInfos);
};

// --------------

/**
 * テンプレートオブジェクトを取得します。
 *
 * @param {string} name - 取得するページの名前。
 * @return {object} - テンプレートオブジェクト。
 */
global.getPageTemplate = (name: string) => {
  const template = HtmlService.createTemplateFromFile(name + '.html').getRawContent();
  let component = 'return {}';
  try {
    component = HtmlService.createTemplateFromFile(name + '.script.html').getRawContent();
  } catch (e) {
    Logger.log(e);
  }

  return {
    template: template,
    componentObjectString: component,
  };
};

global.getScript = (name: string) => {
  return HtmlService.createTemplateFromFile(name + '.html').getRawContent();
};

//-----------------

global.getClassList = () => {
  return classInfos;
};

global.getClassItem = (classID: (string | number)) => {
  return classInfos.find((i) => i.classID == classID);
};

global.getClassInfo = (classID: (string | number)) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classSheet = classSpreadSheet.getSheetByName('クラスの情報');
  return {
    className: classSheet.getRange('B1').getValue(),
    classID: classID,
    shopName: classSheet.getRange('B2').getValue(),
    shopDescription: classSheet.getRange('A4').getValue(),
  };
};

global.setShopInfo = (classID: (string | number), classInfo: {shopName: string, shopDetail: string}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classSheet = classSpreadSheet.getSheetByName('クラスの情報');
  classSheet.getRange("B2").setValue(classInfo.shopName);
  classSheet.getRange("A4").setValue(classInfo.shopDetail);
  classSheet.getRange("D2").setValue(new Date());
};

global.getShopInfo = (classID: (string | number)) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classSheet = classSpreadSheet.getSheetByName('クラスの情報');
  return {shopName: classSheet.getRange("B2").getValue(), shopDetail: classSheet.getRange("A4").getValue()}
};

global.shopInfoTest = () => {
  Logger.log(global.getShopInfo(301));
}

// ----

global.getShopItems = (classID) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  //const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('商品');
  if (classGoodiesSheet.getLastRow() <= 1) {
    return [];
  }
  const shopItemsRange = classGoodiesSheet.getRange(2, 1, classGoodiesSheet.getLastRow() - 1, 2);
  Logger.log(shopItemsRange.getValues().filter((i) => i[0] !== ''))
  return shopItemsRange.getValues().filter((i) => i[0] !== '').map((i) => ({
    name: i[0],
    price: i[1]
  }));
};

global.addShopItems = (classID, item: {name: string, price: string}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('商品');
  if(classGoodiesSheet.getLastRow() > 1) {
    const shopItemsRange = classGoodiesSheet.getRange(2, 1, classGoodiesSheet.getLastRow() - 1, 2);
    const newItem = [item.name, item.price]
    const newShopItems = shopItemsRange.getValues().slice()
    newShopItems.push(newItem)
    Logger.log(newShopItems)
    const newShopItemsRange = classGoodiesSheet.getRange(2, 1, classGoodiesSheet.getLastRow(), 2);
    newShopItemsRange.setValues(newShopItems)
    classInfoSheet.getRange("D3").setValue(new Date())
  } else {
    const newItem = [item.name, item.price]
    const newShopItems = []
    newShopItems.push(newItem)
    Logger.log(newShopItems)
    const newShopItemsRange = classGoodiesSheet.getRange(2, 1, 1, 2);
    newShopItemsRange.setValues(newShopItems)
    classInfoSheet.getRange("D3").setValue(new Date())
  }
};

global.deleteShopItems = (classID, index: number) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('商品');
  classGoodiesSheet.deleteRow(index + 2)
  classInfoSheet.getRange("D3").setValue(new Date())
};

global.editShopItems = (classID, index: number , item: {name: string, price: number}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('商品');
  const shopItemsRange = classGoodiesSheet.getRange(2, 1, classGoodiesSheet.getLastRow() - 1, 2);
  const newItem = [item.name, item.price]
  const newShopItems = shopItemsRange.getValues().slice()
  newShopItems[index] = newItem
  const newShopItemsRange = classGoodiesSheet.getRange(2, 1, classGoodiesSheet.getLastRow() - 1, 2);
  newShopItemsRange.setValues(newShopItems)
  classInfoSheet.getRange("D3").setValue(new Date())
};

//----

global.getBudget = (classID: (string | number)) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classBudgetSheet = classSpreadSheet.getSheetByName('予算');
  return {
    summaryBill: classBudgetSheet.getRange("B1").getValue(),
    studentBill: classBudgetSheet.getRange("B3").getValue(),
    numberOfStudent: classBudgetSheet.getRange("B4").getValue(),
    otherBill: classBudgetSheet.getRange("B5").getValue()
  }
};

global.setBudget = (classID: (string | number), data: {summaryBill: number, studentBill: number, numberOfStudent:number, otherBill:number}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classBudgetSheet = classSpreadSheet.getSheetByName('予算');
  classBudgetSheet.getRange("B1").setValue(data.summaryBill);
  classBudgetSheet.getRange("B2").setValue(data.studentBill * data.numberOfStudent);
  classBudgetSheet.getRange("B3").setValue(data.studentBill);
  classBudgetSheet.getRange("B4").setValue(data.numberOfStudent);
  classBudgetSheet.getRange("B5").setValue(data.otherBill);
  
  classInfoSheet.getRange("D7").setValue(new Date());
};

//----

global.getOutgoGoods = (classID) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  //const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('支出');
  if (classGoodiesSheet.getLastRow() <= 1) {
    return [];
  }
  const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 1, 3);
  Logger.log(shopItemsRange.getValues().filter((i) => i[0] !== ''))
  return shopItemsRange.getValues().filter((i) => i[0] !== '').map((i) => ({
    name: i[1],
    price: i[2]
  }));
};

global.addOutgoGoods = (classID, item: {name: string, price: string, image: string}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('支出');
  if(classGoodiesSheet.getLastRow() > 2) {
    const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 4);
    const newItem = [new Date(), item.name, item.price, item.image]
    const newShopItems = shopItemsRange.getValues().slice().filter((i) => i[0] !== '')
    newShopItems.push(newItem)
    Logger.log(newShopItems)
    const newShopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 1, 4);
    newShopItemsRange.setValues(newShopItems)
    classInfoSheet.getRange("D5").setValue(new Date())
  } else { 
    const newShopItems = [[new Date(), item.name, item.price, item.image]]
    Logger.log(newShopItems)
    const newShopItemsRange = classGoodiesSheet.getRange(3, 1, 1, 4);
    newShopItemsRange.setValues(newShopItems)
    classInfoSheet.getRange("D5").setValue(new Date())
  }
};

global.deleteOutgoGoods = (classID, index: number) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('支出');
  classGoodiesSheet.deleteRow(index + 3)
  classInfoSheet.getRange("D5").setValue(new Date())
};

global.editOutgoGoods = (classID, index: number , item: {name: string, price: string, image: string}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('支出');
  const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 4);
  const newItem = [new Date(), item.name, item.price, item.image]
  const newShopItems = shopItemsRange.getValues().slice()
  newShopItems[index] = newItem
  const newShopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 4);
  newShopItemsRange.setValues(newShopItems)
  classInfoSheet.getRange("D5").setValue(new Date())
};

//----

global.getIncomeGoods = (classID) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  //const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('収入');
  if (classGoodiesSheet.getLastRow() <= 1) {
    return [];
  }
  const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 1, 3);
  Logger.log(shopItemsRange.getValues().filter((i) => i[0] !== ''))
  return shopItemsRange.getValues().filter((i) => i[0] !== '').map((i) => ({
    name: i[1],
    price: i[2]
  }));
};

global.addIncomeGoods = (classID, item: {name: string, price: string}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('収入');
  if(classGoodiesSheet.getLastRow() > 2) {
    const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 3);
    const newItem = [new Date(), item.name, item.price]
    const newShopItems = shopItemsRange.getValues().slice().filter((i) => i[0] !== '')
    newShopItems.push(newItem)
    Logger.log(newShopItems)
    const newShopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 1, 3);
    newShopItemsRange.setValues(newShopItems)
    classInfoSheet.getRange("D6").setValue(new Date())
  } else { 
    const newShopItems = [[new Date(), item.name, item.price]]
    Logger.log(newShopItems)
    const newShopItemsRange = classGoodiesSheet.getRange(3, 1, 1, 3);
    newShopItemsRange.setValues(newShopItems)
    classInfoSheet.getRange("D6").setValue(new Date())
  }
};

global.deleteIncomeGoods = (classID, index: number) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('収入');
  classGoodiesSheet.deleteRow(index + 3)
  classInfoSheet.getRange("D6").setValue(new Date())
};

global.editIncomeGoods = (classID, index: number , item: {name: string, price: string}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('収入');
  const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 3);
  const newItem = [new Date() ,item.name, item.price]
  const newShopItems = shopItemsRange.getValues().slice()
  newShopItems[index] = newItem
  const newShopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 3);
  newShopItemsRange.setValues(newShopItems)
  classInfoSheet.getRange("D6").setValue(new Date())
};

//----

global.getPreOutgoGoods = (classID) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  //const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('準備');
  if (classGoodiesSheet.getLastRow() <= 1) {
    return [];
  }
  const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 1, 3);
  Logger.log(shopItemsRange.getValues().filter((i) => i[0] !== ''))
  return shopItemsRange.getValues().filter((i) => i[0] !== '').map((i) => ({
    name: i[1],
    price: i[2]
  }));
};

global.addPreOutgoGoods = (classID, item: {name: string, price: string}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('準備');
  if(classGoodiesSheet.getLastRow() > 2) {
    const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 3);
    const newItem = [new Date(), item.name, item.price]
    const newShopItems = shopItemsRange.getValues().slice().filter((i) => i[0] !== '')
    newShopItems.push(newItem)
    Logger.log(newShopItems)
    const newShopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 1, 3);
    newShopItemsRange.setValues(newShopItems)
    classInfoSheet.getRange("D4").setValue(new Date())
  } else { 
    const newShopItems = [[new Date(), item.name, item.price]]
    Logger.log(newShopItems)
    const newShopItemsRange = classGoodiesSheet.getRange(3, 1, 1, 3);
    newShopItemsRange.setValues(newShopItems)
    classInfoSheet.getRange("D4").setValue(new Date())
  }
};

global.deletePreOutgoGoods = (classID, index: number) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('準備');
  classGoodiesSheet.deleteRow(index + 3)
  classInfoSheet.getRange("D4").setValue(new Date())
};

global.editPreOutgoGoods = (classID, index: number , item: {name: string, price: string}) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classInfoSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const classGoodiesSheet = classSpreadSheet.getSheetByName('準備');
  const shopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 3);
  const newItem = [new Date() ,item.name, item.price]
  const newShopItems = shopItemsRange.getValues().slice()
  newShopItems[index] = newItem
  const newShopItemsRange = classGoodiesSheet.getRange(3, 1, classGoodiesSheet.getLastRow() - 2, 3);
  newShopItemsRange.setValues(newShopItems)
  classInfoSheet.getRange("D4").setValue(new Date())
};

//------------------

global.getUserProperty = (key) => {
  return PropertiesService.getUserProperties().getProperty(key);
};

global.getUserProperties = () => {
  return PropertiesService.getUserProperties().getProperties();
};

global.setUserProperty = (key, value) => {
  PropertiesService.getUserProperties().setProperty(key, value);
};

global.removeUserProperty = (key) => {
  PropertiesService.getUserProperties().deleteProperty(key);
};

global.removeAllUserProperties = () => {
  PropertiesService.getUserProperties().deleteAllProperties();
};

global.getUserMail = () => {
  return Session.getActiveUser().getEmail();
};
