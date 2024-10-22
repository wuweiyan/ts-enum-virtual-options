/*
 * @Author: wuweiyan@black-unique.com
 * @Date: 2024-09-13 16:10:50
 * @LastEditors: wuweiyan@black-unique.com
 * @LastEditTime: 2024-09-23 15:41:33
 * @Description:
 */
/**
 * jsdoc
 */
// single
export enum Test {
  /**
   * #label(111)
   */
  /**
   * #text(禁用)
   * #label(222)
   */
  No,
  /**
   * #label(启用)
   */
  Yes = 4,
}

export var a = {
  [Test.No]: 11111,
};
