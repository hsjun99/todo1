const pool = require('../modules/pool');
const table = 'tododata';

const tododata = {
    getAllData: async () => {
        const query = `SELECT * FROM ${table}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getAllData ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getAllData ERROR : ', err);
            throw err;
        }
    },
    getData: async (idx) => {
        const query = `SELECT * FROM ${table} WHERE idx=${idx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getData ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getData ERROR : ', err);
            throw err;
        }
    },
    postData: async (content) => {
        const fields = 'content';
        const questions = `?`;
        const values = [content];
        const query2 = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query2, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getAllData ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getAllData ERROR : ', err);
            throw err;
        }
    },
    updateData: async (idx) => {

        const query = `UPDATE ${table} SET done=1-done WHERE idx=${idx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateData ERROR: ', err.errno, err.code);
                return -1;
            }
            console.log("updateData ERROR: ", err);
            throw err;
        }
    },
    checkData: async (idx) => {
        const query = `SELECT * FROM ${table} WHERE idx="${idx}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.length === 0) {
                return false;
            } else return true;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkData ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('checkData ERROR : ', err);
            throw err;
        }
    },
    deleteData: async (idx) => {
        const query = `DELETE FROM ${table} WHERE idx="${idx}"`;
        try {
            const result = await pool.queryParam(query);
            await console.log(result);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteData ERROR: ', err.errno, err.code);
                return -1;
            }
            console.log("deleteData ERROR: ", err);
            throw err;
        }
    },
    deleteAllData: async () => {
        const query = `DELETE FROM ${table}`;
        try {
            const result = await pool.queryParam(query);
            await console.log(result);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteAllData ERROR: ', err.errno, err.code);
                return -1;
            }
            console.log("deleteAllData ERROR: ", err);
            throw err;
        }
    }
}

module.exports = tododata;