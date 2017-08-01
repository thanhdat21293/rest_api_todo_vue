const {db, config} = require('../pgp');
const pgp = require('pg-promise');
const chai = require('chai');
const should = chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const path = require("path");
const pgStructure = require('pg-structure');
const _ = require('lodash');

function sql(file) {
    return new pgp.QueryFile(path.join(__dirname, '../migrations', file), {minify: true});
}

describe("Create tables in database", function () {
    it("It should load 001.do.Todo.sql file to database", function () {
        const script = sql('001.do.Todo.sql');
        let result = db.result(script)
            .then(function () {
                return "Create success";
            })
            .catch((error) => {
                console.log(error);
                return "failed";
            });

        return result.should.eventually.equal("Create success");
    });

    it("Schema should have tables: todolist", function () {

        const check_table_promise = pgStructure({
            database: config.database,
            user: config.username,
            password: config.password,
            host: config.host,
            port: config.port
        }, config.schema).then(database => {
            const tables = database.schemas.get(config.schema).tables;  // Map of Table objects.
            const table_names = Array.from(tables.keys());
            return _.difference(['todolist'], table_names).length;
        });

        return check_table_promise.should.eventually.equal(0);

    });

    it("It should have 4 records in table todolist", function () {

        let count = db.none("INSERT INTO todolist(title, completed) VALUES ('Todo 1', 'true'), ('Todo 2', 'true'), ('Todo 3', 'false'), ('Todo 4', 'true')")
            .then(function () {
                //đếm số bản ghi
                return db.one("SELECT COUNT(*) FROM todolist")
                    .then(function (data) {
                        return parseInt(data.count);
                    }).catch(function (error) {
                        return error;
                    });
            });

        return count.should.eventually.equal(4);

    });


});