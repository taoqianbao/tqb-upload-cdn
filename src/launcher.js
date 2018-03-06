/**
 * @file 上传静态文件到静态资源服务器
 */

'use strict';

//提示cli模块
import DEBUG from 'g-debug';
//promise对象
import q from 'q';
//文件util对象
import fileUtil from 'g-file';
//工具模块
import util from './util';
//缓存模块
import { find, insert } from './cache';
//md5
import md5 from 'md5';
//uploader
import uploader from './uploader';

/**
 * @class 发送静态文件类
 */
class launcher {

    /**
     * @constructor
     * @param opts
     */
    constructor(opts) {
        opts = opts || {};
        this.uploader = new uploader({
            host: opts.host,
            max: opts.max || 6,
            prefix: opts.prefix || 'img'
        });
    }

    /**
     * @public
     * @method upload
     * @desc 上传图片
     * @param opts
     * @param opts.files {String} 上传图片的路径 支持绝对路径相对路径
     * @returns {*|promise}
     */
    upload(opts) {
        const deferred = q.defer();
        opts = opts || {};
        if (!opts.files) {
            deferred.reject((DEBUG.error('传入的上传文件地址为空'), '传入的上传文件地址为空'));
        } else {
            var files = fileUtil.isFile(opts.files) ? opts.files : opts.files.replace(/^\//, './');
            var key,
                url = util.getFileContent(files),
                uploadResult = {};
            if (!url) {
                deferred.reject('传入的上传文件: ' + files + ' 地址不存在');
            } else {
                key = (typeof url != 'string') ? md5(url.code + '|' + url.type) : md5(url);
                find(key)
                    .then((data) => {
                        if (data && data['url'] && fileUtil.isUrl(data['url'])) {
                            uploadResult[files] = data['url'];
                            deferred.resolve(uploadResult);
                        } else {
                            throw new Error("Get cache fail!");
                        }
                    })
                    .catch(() => {
                        this.uploader.upload(url)
                            .then((result) => {
                                uploadResult[files] = result;
                                insert(key, result)
                                    .then(() => {
                                        deferred.resolve(uploadResult);
                                    })
                                    .catch(() => {
                                        deferred.resolve(uploadResult);
                                    })
                            })
                            .catch((msg) => {
                                deferred.reject(msg);
                            });
                    });
            }
        }
        return deferred.promise;
    }
}

export default launcher;