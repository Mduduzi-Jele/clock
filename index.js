const App = () => {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(
    new Audio("./BeepSoundEffect.mp3")
  );

  const playBreakSound = () => {
      breakAudio.currentTime = 0;
      breakAudio.play();
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type == "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime(breakTime + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime(sessionTime + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
              if(prev <= 0 && !onBreakVariable){
                  playBreakSound()
                  onBreakVariable=true;
                  setOnBreak(true)
                  return breakTime;
              } else if(prev <= 0 && onBreakVariable){
                playBreakSound()
                onBreakVariable=false;
                setOnBreak(false)
                return sessionTime;
              }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  return (
    <div className="container-fluid text-center">
      <div className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-center"><h3 className="text-white">25 + 5 clock</h3></div>
      <div className="container">
        <Length
          title={"break length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />

        <Length
          title={"session length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
      </div>
      <h3>{onBreak ? "Break" : "Session"}</h3>
      <h1>{formatTime(displayTime)}</h1>
      <button onClick={() => controlTime()}>
        {timerOn ? <i class="bi bi-pause"></i> : <i class="bi bi-play"></i>}
      </button>
      <button onClick={() => resetTime()}>
      <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>
  );
};

const Length = ({ title, changeTime, type, time, formatTime }) => {
  return (
    <div className="text-center">
      <h3 className="text-center">{title}</h3>
      <h3>{formatTime(time)}</h3>
      <button className="btn btn-success" onClick={() => changeTime(-60, type)}>
      <i class="bi bi-arrow-down"></i>
      </button>
      <button className="btn btn-primary" onClick={() => changeTime(60, type)}>
      <i class="bi bi-arrow-up"></i>
      </button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
