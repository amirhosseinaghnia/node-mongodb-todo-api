const chai = require('chai');
const should = chai.should();
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

// beforeEach((done) => {
//     Todo.remove({}).then(() => done());
// });

describe('POST /todos', () => {
    it('should add new todo', (done) => {

        var text = 'test todo';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                res.body.text.should.equal(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
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
        var todo = { text: "update from test", completed: true };
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
        var todo = { text: "update second todo from test", completed: false };

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
});

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                res.body._id.should.equal(users[0]._id.toHexString());
                res.body.email.should.equal(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                res.body.should.be.empty;
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'test@yahoo.com';
        var password = 'amn123!';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                res.headers['x-auth'].should.exist;
                res.body._id.should.exist;
                res.body.email.should.equal(email);
            })
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findOne({ email }).then((user) => {
                    user.should.be.exist;
                    user.password.should.not.equal(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation erroros if request invalid', (done) => {
        var email = 'tes';
        var password = 'amn123!';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        var email = users[0].email;
        var password = 'amn123!';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login and return auth token', (done) => {
        var email = users[0].email;
        var password = users[0].password;

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                res.headers['x-auth'].should.exist;
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    user.tokens[1].should.deep.include({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        var email = users[0].email;
        var password = users[1].password;

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                chai.expect(res.headers['x-auth']).to.not.exist;
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    chai.expect(user.tokens).to.have.lengthOf(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    chai.expect(user.tokens).to.have.lengthOf(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});
