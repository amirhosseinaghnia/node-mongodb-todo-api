const chai = require('chai');
const should = chai.should();
const request = require('supertest');

const {app} = require('./../server');
const{Todo} = require('./../models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done());
});

describe('POST /todos', () =>{
    it('should add new todo', (done) =>{

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

                Todo.find().then((todos) => {
                    todos.should.have.lengthOf(1);
                    todos[0].text.should.equal(text);
                    done();
                }).catch((e) => done(e));
            })
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
                    todos.should.have.lengthOf(0);
                    done();
                }).catch((err) => done(err));
            })
    })

});

