const chai = require('chai');
const should = chai.should();
const request = require('supertest');
const{ObjectID} = require('mongodb');

const {app} = require('./../server');
const{Todo} = require('./../models/todo');

var todos = [{
    _id: new ObjectID(),
    text: 'firs todo test'
}, {
    _id: new ObjectID(),
    text: 'second todo test',
    completed: true,
    completedAt: 444
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
});

// beforeEach((done) => {
//     Todo.remove({}).then(() => done());
// });

describe('POST /todos', () =>{
    it('should add new todo', (done) => {

        var text = 'test todo';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                res.body.text.should.equal(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    todos.should.have.lengthOf(1);
                    todos[0].text.should.equal(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not creat todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    todos.should.have.lengthOf(2);
                    done();
                }).catch((err) => done(err));
            })
    })

});

describe('GET /todos', () => {

    it('should get all todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                res.body.todos.should.have.lengthOf(2);
            })
            .end(done);

    });

});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                res.body.todo.text.should.equal(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/id:', () => {
    
    it('should remove a todo', (done) => {

        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                res.body.todo._id.should.equal(hexId);
            })
            .end((err, res) => {
                
                if (err) {
                    return done(err);
                }

                Todo.findById(todos[0]._id).then((todo) => {
                    should.not.exist(todo);
                    done();
                }).catch((err) => done(err));

            });
    });

    it('should rturn 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should rturn 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var todo = {text: "update from test", completed: true};
        request(app)
            .patch(`/todos/${id}`)
            .send(todo)
            .expect(200)
            .expect((res) => {
                res.body.todo.text.should.equal(todo.text);
                res.body.todo.completed.should.equal(true);
                res.body.todo.completedAt.should.be.a("number");
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(todos[0]._id).then((td) => {
                    td.text.should.equal(todo.text);
                    td.completed.should.equal(todo.completed);
                    td.completedAt.should.be.a("number");
                    done();
                }).catch((err) => done(err));
            });

    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var todo = {text: "update second todo from test", completed: false};

        request(app)
            .patch(`/todos/${id}`)
            .send(todo)
            .expect(200)
            .expect((res) => {
                res.body.todo.text.should.equal(todo.text);
                res.body.todo.completed.should.equal(false);
                should.not.exist(res.body.todo.completedAt);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(todos[1]._id).then((td) => {
                    td.text.should.equal(todo.text);
                    td.completed.should.equal(todo.completed);
                    should.not.exist(td.completedAt);
                    done();
                }).catch((err) => done(err));
            });
    });
})

