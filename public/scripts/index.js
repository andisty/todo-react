'use strict'
const API_URL = 'https://hidden-fjord-50441.herokuapp.com/todos'
const TodoApp = React.createClass({
  getInitialState () {
    console.info('TodoApp - getInitialState')
    return {
      data: []
    }
  },
  componentDidMount () {
    console.info('TodoApp - componentDidMount')
    this.loadData()
  },
  loadData () {
    console.info('TodoApp - loadData')
    const app = this
    $.ajax({
      url: API_URL,
      dataType: 'json',
      cache: false,
      success (data) {
        console.log('TodoApp - data loaded', data)
        app.setState({data: data})
      },
      error (xhr, status, err) {
        console.error('TodoApp - data loaded error')
        console.error(API_URL, status, err.toString())
      }
    })
  },
  onTodoDelete (todoId) {
    console.info('TodoApp - onTodoDelete', todoId)
    let app = this
    $.ajax({
      method: 'DELETE',
      url: API_URL + '/' + todoId,
      dataType: 'json',
      cache: false,
      success () {
        console.log('TodoApp - onTodoDelete success')
        let todos = app.state.data.filter((item) => {
          return item.id !== todoId
        })
        app.setState({data: todos})
      },
      error (xhr, status, err) {
        console.log('TodoApp - onTodoSubmit error')
        console.error(API_URL, status, err.toString())
      }
    })
  },
  onTodoSubmit (todo) {
    console.info('TodoApp - onTodoSubmit', todo)
    let todos = this.state.data
    let app = this
    $.ajax({
      method: 'POST',
      url: API_URL,
      dataType: 'json',
      cache: false,
      data: {
        todo: todo
      },
      success (data) {
        console.log('TodoApp - onTodoSubmit success', data)
        todos.push(data)
        app.setState({data: todos})
      },
      error (xhr, status, err) {
        console.log('TodoApp - onTodoSubmit error')
        console.error(API_URL, status, err.toString())
      }
    })
  },
  render () {
    console.info('TodoApp - render')
    return (
      <div className='todoContainer'>
        <h1>Todo App</h1>
        <TodoForm onTodoSubmit={this.onTodoSubmit} />
        <TodoList data={this.state.data} onTodoDelete={this.onTodoDelete} />
      </div>
    )
  }
})

const TodoForm = React.createClass({
  getInitialState () {
    return {
      title: ''
    }
  },
  handleTitleChange (e) {
    console.info('TodoForm - handleTitleChange', e.target.value)
    this.setState({
      title: e.target.value
    })
  },
  handleSubmit (e) {
    e.preventDefault()
    let title = this.state.title.trim()
    if (!title) return
    this.props.onTodoSubmit({
      title: title
    })
    this.setState({
      title: ''
    })
  },
  render () {
    console.info('TodoForm - render')
    return (
      <form className='todoForm' onSubmit={this.handleSubmit}>
        <div className='input-field'>
          <input type='text' placeholder='something to do?' onChange={this.handleTitleChange} value={this.state.title} />
          <button className='btn waves-effect waves-light' type='submit' name='action'>Create!</button>
        </div>
      </form>
    )
  }
})

const TodoList = React.createClass({
  render () {
    console.info('TodoList - render')
    let todoNodes = this.props.data.map((item, i) => {
      return (
        <TodoItem
          todoId={item.id}
          completed={item.completed}
          title={item.title}
          onTodoDelete={this.props.onTodoDelete}
          key={i}
        />
      )
    })
    return (
      <div className='todoList'>
        {todoNodes}
      </div>
    )
  }
})

let TodoItem = React.createClass({
  getInitialState () {
    return {
      completed: this.props.completed,
      title: ''
    }
  },
  handleDelete (e) {
    console.info('TodoItem - handleDelete', this.props.todoId)
    console.log(this.props)
    this.props.onTodoDelete(this.props.todoId)
  },
  handleCheckbox (e) {
    console.info('TodoItem - handleCheckbox', e.target.checked)
    this.setState({
      completed: e.target.checked
    })
    const todoId = this.props.todoId
    $.ajax({
      url: API_URL + '/' + todoId,
      method: 'PUT',
      data: {
        todo: {
          completed: e.target.checked
        }
      },
      dataType: 'json',
      cache: false,
      success () {
        console.log('TodoItem - handleCheckbox success')
      },
      error (xhr, status, err) {
        console.error('TodoItem - handleCheckbox error')
        console.error(API_URL, status, err.toString())
      }
    })
  },
  render () {
    console.info('TodoItem - render')
    let isChecked = false
    if (this.state && this.state.hasOwnProperty('completed')) {
      isChecked = this.state.completed
    } else {
      isChecked = this.props.completed
    }
    let checkId = 'todo-' + this.props.todoId
    let inputChecbox = isChecked
      ? <input type='checkbox' id={checkId} checked onChange={this.handleCheckbox} />
      : <input type='checkbox' id={checkId} onChange={this.handleCheckbox} />
    return (
      <div className='todoItem input-field'>
        <i className='material-icons prefix' onClick={this.handleDelete}>delete</i>
        {inputChecbox}
        <label htmlFor={checkId} >{this.props.title}</label>
      </div>
    )
  }
})

ReactDOM.render(
  <TodoApp />,
  document.getElementById('container')
)
