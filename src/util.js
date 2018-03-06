/**
 * @file 工具模块
 * @type {exports}
 */

'use strict';

//文件模块
import fs from 'fs';
//lodash
import _ from 'lodash';
//文件工具模块
import fileUtil from 'g-file';
//path模块
import pathUtil from 'path';

/**
 * @desc urlencode
 */
function urlencode(str) {
	return escape(str).replace(/\+/g, '%2B').replace(/%20/g, '+').replace(/\*/g, '%2A')
		.replace(/\//g, '%2F').replace(/@/g, '%40');
}

export default {

	/**
	 * @desc 获取文件内容
	 * @param path
	 * @return String
	 */
	getFileContent(path) {
		if (fileUtil.isFile(path)) {
			if (fileUtil.isImage(path)) {
				return urlencode(_.trim(fs.readFileSync(path, 'binary')));
			} else if (/\.(?:js|css)$/ig.test(path)) {
				return {
					type: pathUtil.extname(path).slice(1),
					code: fs.readFileSync(path, 'utf8')
				}
			} else {
				return {
					type: pathUtil.extname(path).slice(1),
					code: fs.readFileSync(path, 'base64')
				}
			}
		} else if (fileUtil.isUrl(path)) {
			return path;
		}
		return null;
	},

	/**
	 * @desc rawurlencode
	 */
	rawurlencode(str) {
		str = (str + '').toString();
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27')
			.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
	}
};