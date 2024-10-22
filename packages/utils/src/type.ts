/*
 * @Author: wuweiyan@black-unique.com
 * @Date: 2024-09-04 15:44:24
 * @LastEditors: wuweiyan@black-unique.com
 * @LastEditTime: 2024-09-12 18:07:08
 * @Description: 
 */
export interface PluginConfig {
    customMatcher?: string;
    outputFormat?: 'map' | 'array' | 'both'
    mapSuffix?: string;
    arraySuffix?: string;
}