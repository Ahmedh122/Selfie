import mongoose from "mongoose";

const timerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  donepomo: { type: Number, required: true }, // numero di pomodori completati
  remainingTime: { type: Number, required: true }, // tempo che rimane al mode corrente
  mode : { type: Number, required: true }, // 1=work, 2=short break, 3=long break (che modalita è attiva)
  workTime : { type: Number, required: true }, // tempo di lavoro
  shortBreakTime : { type: Number, required: true }, // tempo di pausa breve
  longBreakTime : { type: Number, required: true }, // tempo di pausa lunga
  longBreakInterval : { type: Number, required: true }, // intervallo tra le pause lunghe
  taskname : { type: String, required: true }, // nome della task associata al timer (deve essere univoco?)
  eventId : { type: String, required: false}, // id dell'evento associato al timer se presente deve essere univoco
  lastModifiedDate : { type: Date, default: Date.now , required: true }, // data e ora dell'ultima modifica
});

const Timer = mongoose.model("Timer", timerSchema);

export default Timer;
