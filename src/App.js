import React from 'react';
import * as alasql from 'alasql';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = { todo: [] };
  }

  componentWillMount() {
    alasql(`
      CREATE LOCALSTORAGE DATABASE IF NOT EXISTS todo_db;
      ATTACH LOCALSTORAGE DATABASE todo_db;
      USE todo_db;
    `);
    alasql('CREATE TABLE IF NOT EXISTS todo (id INT AUTOINCREMENT PRIMARY KEY, text STRING)');
  }

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos() {
    const result = alasql('SELECT * FROM todo');
    this.setState({ todo: result });
  }

  insertTodo(text) {
    alasql('INSERT INTO todo VALUES ?',
      [{ id: alasql.autoval('todo', 'id', true), text }]);
  }

  deleteTodo(id) {
    alasql('DELETE FROM todo WHERE id = ?', id);
  }

  addTodo() {
    const { inputTodo } = this.refs;

    if (!inputTodo.value) return;

    this.insertTodo(inputTodo.value);
    this.fetchTodos();
    inputTodo.value = "";
  }

  removeTodo(id) {
    this.deleteTodo(id);
    this.fetchTodos();
  }

  render() {
    const { todo } = this.state;

    return (
      <main className="container">
        <h1 className="mt-4">TODO List App</h1>
        <div className="row mt-4">
          <form className="form-inline">
            <div className="form-group mx-sm-3 mb-2">
              <label for="inputTodo" className="sr-only">Todo</label>
              <input type="text" ref="inputTodo" className="form-control" id="inputTodo" placeholder="Todo"/>
            </div>
            <button type="button" className="btn btn-primary mb-2" onClick={ e => this.addTodo() }>Add</button>
          </form>
        </div>

        <div className="row">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>TODO</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
              !todo.length &&
              <tr>
                <td colspan="3" className="text-center">
                  No data available
                </td>
              </tr>
              }
              {
              todo.length > 0 && todo.map(x => (
              <tr>
                <td>{ x.id }</td>
                <td>{ x.text }</td>
                <td>
                  <button className="btn btn-danger" onClick={ e => this.removeTodo(x.id) }>
                    x
                  </button>
                </td>
              </tr>
              ))
              }
            </tbody>
          </table>
        </div>
      </main>
      );
  }
}

export default App;
