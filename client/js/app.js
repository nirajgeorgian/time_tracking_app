// data which changes with time should be in state and
// data which do not change over time should be in props
// example: - time component just need to render time so it's data should be in props
// and EditTimer needs to change time data so it should be in state
// calculate the time difference inside the timer component and use
// forceUpdate to forcefully update it
// apply forceUpdate on an timeinterval to update it constantly
class TimersDashboard extends React.Component {
  // it will have the initial state data to render the form data
  state = {
    timers: [
      {
        title: 'Practice squat',
        project: 'Gym Chores',
        id: uuid.v4(),
        elapsed: 5456099,
        runningSince: Date.now(),
      }, {
        title: 'Bake squash',
        project: 'Kitchen Chores',
        id: uuid.v4(),
        elapsed: 1273998,
        runningSince: null,
      },
    ]
  }
  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer)
  }
  createTimer = (timer)  => {
    const t = helpers.newTimer(timer)
    this.setState({
      timers: this.state.timers.concat(t)
    })
  }
  handleEditFormSubmit = (timer) => {
    this.updateTimer(timer)
  }
  updateTimer = (attr) => {
    const newTimer = this.state.timers.map(timer => {
      if(timer.id === attr.id) {
        return Object.assign({}, timer, {
          title: attr.title,
          project: attr.project
        })
      } else {
        return timer
      }
    })
    this.setState({
      timers: newTimer
    })
  }
  deleteTimer = (timerId) => {
    this.setState({
      timers: this.state.timers.filter((t) => {
        return t.id != timerId
      })
    })
  }
  startTimer = (timerId) => {
    console.log(timerId);
    const now = new Date()
    this.setState({
      timers: this.state.timers.map((timer) => {
        if(timer.id == timerId) {
          return Object.assign({}, timer, {
            runningSince: now,
          })
        } else {
          return timer
        }
      })
    })
  }
  stopTimer = (timerId) => {
    console.log(timerId);
    const now = new Date()
    this.setState({
      timers: this.state.timers.map((timer) => {
        if(timer.id == timerId) {
          const lastElapsed = now - timer.runningSince
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            runningSince: null,
          })
        } else {
          return timer
        }
      })
    })
  }
  handleTrashClick = (timerId) => {
    this.deleteTimer(timerId)
  }
  handleStartClick = (timerId) => {
    this.startTimer(timerId)
  }
  handleStopClick = (timerId) => {
    this.stopTimer(timerId)
  }
  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
          />
        <ToggleableTimerForm
          onFormSubmit={this.handleCreateFormSubmit}
        />
        </div>
      </div>
    )
  }
}

class EditableTimerList extends React.Component {
  render() {
    const timers = this.props.timers.map(timer => (
      <EditableTimer
        key={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        id={timer.id}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}
      />
    ))
    return (
      <div id='timers'>
        {timers}
      </div>
    )
  }
}

class EditableTimer extends React.Component {
  state = {
    editFormOpen: false,
  }
  handleEditClick = (event) => {
    this.setState({
      editFormOpen: true
    })
  }
  handleFormClose = (event) => {
    this.formClose()
  }
  handleFormSubmit = (timer) => {
    this.props.onFormSubmit(timer)
    this.formClose()
  }
  formClose = (event) => {
    this.setState({
      editFormOpen: false
    })
  }
  render() {
    const timers = this.props.timers
    if(this.state.editFormOpen) {
      return (
        <TimerForm
          key={this.props.id}
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          onFormClose={this.handleFormClose}
          onFormSubmit={this.handleFormSubmit}
        />
      )
    } else {
      return (
        <Timer
          key={this.props.id}
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
        />
      )
    }
  }
}

class TimerForm extends React.Component {
  state = {
    title: this.props.title || '',
    project: this.props.project || ''
  }
  handleTitleChange = (event) => {
    this.setState({
      title: event.target.value
    })
  }
  handleProjectChange = (event) => {
    this.setState({
      project: event.target.value
    })
  }
  handleSubmit = (event) => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project
    })
  }
  render() {
    const submitText = this.props.id ? 'Update' : 'Create'
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title: </label>
              <input type='text' value={this.state.title} onChange={this.handleTitleChange}/>
            </div>
            <div className='field'>
              <label>Project: </label>
              <input type='text' value={this.state.project} onChange={this.handleProjectChange}/>
            </div>
            <div className='ui two bottom attached buttons'>
              <button className='ui basic blue button' onClick={this.handleSubmit}>
                {submitText}
              </button>
              <button className='ui basic red button' onClick={this.props.onFormClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ToggleableTimerForm extends React.Component {
  state = {
    isOpen: false
  }
  handleFormOpen = (event) => {
    this.setState({
      isOpen: true
    })
  }
  handleFormClose = (event) => {
    this.setState({
      isOpen: false
    })
  }
  handleFormSubmit = (timer) => {
    this.props.onFormSubmit(timer)
    // after setting the form we want to close the form
    this.setState({
      isOpen: false
    })
  }
  render() {
    if(this.state.isOpen) {
      return (
        <TimerForm
          onFormClose={this.handleFormClose}
          onFormSubmit={this.handleFormSubmit}
        />
      )
    } else {
      return (
        <div className='ui basic content center alligned segment'>
          <button className='ui basic button icon'
            onClick={this.handleFormOpen}
          >
            <i className='plus icon' />
          </button>
        </div>
      )
    }
  }
}

class Timer extends React.Component {
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50)
  }
  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval)
  }
  handleStartClick = () => {
    this.props.onStartClick(this.props.id)
  }
  handleStopClick = () => {
    this.props.onStopClick(this.props.id)
  }
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id)
  }
  render() {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='header'>
            {this.props.title}
          </div>
          <div className='meta'>
            {this.props.project}
          </div>
          <div className='center aligned description'>
            <h2>
              {elapsedString}
            </h2>
          </div>
          <div className='extra content'>
            <span className='right floated edit icon' onClick={this.props.onEditClick}>
              <i className='edit icon' />
            </span>
            <span className='right floated trash icon' onClick={this.handleTrashClick}>
              <i className='trash icon' />
            </span>
          </div>
        </div>
        <TimerActionButton
          timerIsRunning={!!this.props.runningSince}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
        />
      </div>
    )
  }
}

class TimerActionButton extends React.Component {
  render() {
    if(this.props.timerIsRunning) {
      return (
        <div className='ui bottom attached red basic button' onClick={this.props.onStopClick}>
          Stop
        </div>
      )
    } else {
      return (
        <div className='ui bottom attached green basic button' onClick={this.props.onStartClick}>
          Start
        </div>
      )
    }
  }
}

ReactDOM.render(
  <TimersDashboard />,
  document.getElementById('content')
);
