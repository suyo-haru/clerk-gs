const TEMPLATE_SHEET_NAME = {
  クラスの情報: 'Template.Infomation',
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
    .addSeparator()
    .addSubMenu(ui.createMenu('デバッグ').addItem('なし', 'hoge'))
    .addToUi();
};

global.doGet = (e) => {
  return HtmlService.createTemplateFromFile('index.html').evaluate();
  //return ContentService.createTextOutput(HtmlService.createTemplateFromFile("layout.html").getRawContent());
};

global.doPost = (e) => {
  Logger.log(e.postData.type);
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
global.getPageTemplate = (name) => {
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

global.getScript = (name) => {
  return HtmlService.createTemplateFromFile(name + '.html').getRawContent();
};

global.testFn = () => {
  Logger.log(global.getPageTemplate('app'));
};

//-----------------

global.getClassList = () => {
  return classInfos;
};

global.getClassItem = (classID) => {
  return classInfos.find((i) => i.classID == classID);
};

/**
 * @param {string | number} classID
 * @return {{className: string, classID: string | number, shopName: string, shopDescription: string}}
 */
global.getClassInfo = (classID) => {
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

/**
 * @param {string | number} classID
 * @return {{className: string, classID: string | number, shopName: string, shopDescription: string}}
 */
global.setShopInfo = (classID, classInfo) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classSheet = classSpreadSheet.getSheetByName('クラスの情報');
};

global.getShopItems = (classID) => {
  const classSpreadSheetUrl = classInfos.find((i) => i.classID == classID).spreadSheetUrl;
  const classSpreadSheet = SpreadsheetApp.openByUrl(classSpreadSheetUrl);
  const classSheet = classSpreadSheet.getSheetByName('クラスの情報');
  const shopItemsRange = classSheet.getRange(2, 3, classSheet.getLastRow() - 1, 3);
  return shopItemsRange.getValues().filter((i) => i[0] !== '');
};

global.hog = () => {
  Logger.log(global.getClassInfo(301));
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
  return Session.getUser().getEmail();
};
