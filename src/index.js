const config = require('./config')

module.exports = function init (options) {
	// 检查配置项
    const { uploadUrl } = options
    if ([uploadUrl].some(v => v === undefined)) throw new Error('ERRORS.ERR_INIT_SDK_LOST_CONFIG')
    
    // 初始化配置
    const configs = config.set(options)

    console.log('using config: %o', configs)

    return {
        config,
        launcher: require('./launcher').default,
        uploader: require('./uploader').default
    }
}