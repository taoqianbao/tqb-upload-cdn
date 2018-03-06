/**
 * @file 缓存模块
 */

'use strict';

//lokijs db without server
import lokijs from 'lokijs';
//promise
import q from 'q';

var
	/**
	 * @desc instance of db
	 */
	db = new lokijs('picasso.json'),

	/**
	 * @desc collection
	 * @type {null}
	 */
	collection = null;


/**
 * @desc 初始化collection
 */
function getCollection() {
	var deferred = q.defer();
	if (collection) {
		deferred.resolve(collection);
	} else {
		try {
			db.loadDatabase({}, () => {
				var picasso = db.getCollection('picasso');
				if (picasso && picasso.data) {
					deferred.resolve(picasso);
				} else {
					collection = db.addCollection('picasso');
					db.saveDatabase();
					deferred.resolve(collection);
				}
			});
		} catch (e) {
			deferred.reject(new Error('Initialize database fail!'));
		}
	}
	return deferred.promise;
}

/**
 * @desc 插入数据
 * @type {{insert: *}}
 */
function insert(key, value) {
	var deferred = q.defer();
	getCollection()
		.then((collection) => {
			var item = {
				'key': key,
				'url': value
			}
			collection.insert(item);
			db.saveDatabase();
			deferred.resolve(item);
		});
	return deferred.promise;
}

/**
 * @desc 更新数据
 * @type {{insert: insert, update: *}}
 */
function update(key, value) {
	var deferred = q.defer();
	getCollection()
		.then((collection) => {
			var item = collection.findOne({'key': key});
			item.url = value;
			collection.update(item);
			db.saveDatabase();
			deferred.resolve(item);
		});
	return deferred.promise;
}

/**
 * @desc find
 * @type {{insert: insert, update: update, find: (find|*)}}
 */
function find(key) {
	var deferred = q.defer();
	getCollection()
		.then((collection) => {
			var item = collection.findOne({'key': key});
			deferred.resolve(item);
		});
	return deferred.promise;
}

export {
	insert,
	update,
	find
};