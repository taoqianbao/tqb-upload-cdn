/**
 * @file 文件上传模块
 */

'use strict';

//promise
import q from 'q';//http request
import request from 'request';
const config = require('./config')

//上传图片的接口 目前只有内网权限才能上传
const url = config.uploadUrl;

/**
 * @class uploader
 * @desc 上传图片
 */
export default class uploader {

    /**
	 * @constructor
	 * @param opts {Object}
	 * @param opts.prefix {String} 资源域名前缀
	 * @param opts.max {Number} 最大可取数字前缀
	 * @param opts.host {String} 资源域host
	 */
	constructor(opts) {
		this.prefix = opts.prefix;
		this.max = opts.max;
		this.host = opts.host;
	}

	/**
	 * @desc 上传
	 * @param content
	 * @returns {*|promise}
	 */
	upload(content) {
		const deferred = q.defer();
		request({
			url: url,
			method: 'POST',
			header: {
				Host: config.Host
			},
			form: {
				image: content,
				type: 'js'
			}
		}, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				return deferred.reject(error || new Error('statusCode: ' + response.statusCode))
			}
			try {
				body = JSON.parse(body)
			} catch (e) {
				return deferred.reject(e);
			}
			var errStatus = body.status;
			if (errStatus != 200) {
				return deferred.reject(new Error(body.msg));
			}
			if (!body.data && !body.data.name) {
				return deferred.reject(new Error('上传错误'));
			}
			var cdnUrl = 'http://' + this.prefix + Math.max((Math.random() * this.max >> 0), 1) + '.'
				+ this.host + body.data.name;
			deferred.resolve(cdnUrl);
		})
		return deferred.promise;
	}
}