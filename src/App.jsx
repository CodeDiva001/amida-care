
import { useEffect, useState } from "react";
import "./App.css";

const initialHabits = [
  { id: 1, name: "Drink 8 glasses of water" },
  { id: 2, name: "Exercise for 20 minutes" },
  { id: 3, name: "Read or learn something" },
  { id: 4, name: "Complete my skincare routine" },
];

const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const moods = [
  "😊 Happy",
  "🙏 Grateful",
  "😌 Peaceful",
  "😢 Sad",
  "😟 Anxious",
  "😩 Overwhelmed",
  "🔥 Motivated",
  "😴 Tired",
];

const incomeCategories = [
  "Salary",
  "Extra income",
  "Gift received",
  "Other income",
];

const expenseCategories = [
  "Food",
  "Transport",
  "Mobile data",
  "Bills",
  "Family gifts",
  "Shopping",
  "Health",
  "Personal care",
  "Education",
  "Other expense",
];

const WATER_GOAL = 8;
const GLASS_SIZE = 250;

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatJournalDate(dateKey) {
  if (!dateKey) return "";

  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDalasi(amount) {
  return `D ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const financeLabelStyle = {
  display: "block",
  marginBottom: "9px",
  color: "#75445e",
  fontWeight: "600",
  fontSize: "14px",
};

const financeFieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "13px",
  border: "1px solid #eadce4",
  background: "#fff9fc",
  color: "#75445e",
  fontSize: "15px",
  outline: "none",
  marginBottom: "19px",
};

function App() {
  const today = getDateKey();

  // HABITS
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem("habits");

      return saved
        ? JSON.parse(saved).map(({ id, name }) => ({ id, name }))
        : initialHabits;
    } catch {
      return initialHabits;
    }
  });

  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("completedDays"));

      if (saved) return saved;

      const oldHabits = JSON.parse(localStorage.getItem("habits"));

      const completed = oldHabits
        ?.filter(habit => habit.done)
        .map(habit => habit.id) || [];

      return completed.length ? { [today]: completed } : {};
    } catch {
      return {};
    }
  });

  // PRAYER
  const [prayerHistory, setPrayerHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("prayerHistory")) || {};
    } catch {
      return {};
    }
  });

  // WATER
  const [waterHistory, setWaterHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("waterHistory")) || {};
    } catch {
      return {};
    }
  });

  // NAVIGATION
  const [tab, setTab] = useState("Today");

  // HABIT MANAGEMENT
  const [newHabit, setNewHabit] = useState("");
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingHabitName, setEditingHabitName] = useState("");

  // JOURNAL
  const [journalEntries, setJournalEntries] = useState(() => {
    try {
      const savedEntries = localStorage.getItem("journalEntries");

      if (savedEntries !== null) {
        return JSON.parse(savedEntries) || [];
      }

      const oldJournal = localStorage.getItem("journal");

      if (oldJournal && oldJournal.trim()) {
        return [{
          id: Date.now(),
          date: today,
          mood: "🤍 Previous reflection",
          text: oldJournal,
        }];
      }

      return [];
    } catch {
      return [];
    }
  });

  const [journalDraft, setJournalDraft] = useState("");
  const [selectedMood, setSelectedMood] = useState(moods[0]);

  // FINANCE TRACKER
  const [financeTransactions, setFinanceTransactions] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("financeTransactions")
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [transactionType, setTransactionType] = useState("expense");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("Food");
  const [transactionDate, setTransactionDate] = useState(today);
  const [transactionNote, setTransactionNote] = useState("");

  // TODAY'S DATA
  const completedToday = completedDays[today] || [];
  const todaysPrayers = prayerHistory[today] || [];
  const waterCount = waterHistory[today] || 0;

  // AUTOMATIC DATA SAVING
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("completedDays", JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem("prayerHistory", JSON.stringify(prayerHistory));
  }, [prayerHistory]);

  useEffect(() => {
    localStorage.setItem("waterHistory", JSON.stringify(waterHistory));
  }, [waterHistory]);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem(
      "financeTransactions",
      JSON.stringify(financeTransactions)
    );
  }, [financeTransactions]);

  // DAILY PROGRESS
  const completed = habits.filter(habit =>
    completedToday.includes(habit.id)
  ).length;

  const progress = habits.length
    ? Math.round((completed / habits.length) * 100)
    : 0;

  const prayerProgress = Math.round(
    (todaysPrayers.length / 5) * 100
  );

  const waterAmount = waterCount * GLASS_SIZE;
  const waterProgress = Math.round((waterCount / WATER_GOAL) * 100);

  // FINANCE CALCULATIONS
  const totalIncome = financeTransactions
    .filter(item => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpenses = financeTransactions
    .filter(item => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const availableBalance = totalIncome - totalExpenses;

  // HABIT FUNCTIONS
  function toggleHabit(id) {
    setCompletedDays(previous => {
      const current = previous[today] || [];

      const updated = current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id];

      return { ...previous, [today]: updated };
    });
  }

  function addHabit(e) {
    e.preventDefault();

    if (!newHabit.trim()) return;

    setHabits(previous => [
      ...previous,
      { id: Date.now(), name: newHabit.trim() },
    ]);

    setNewHabit("");
  }

  function startEditing(habit) {
    setEditingHabitId(habit.id);
    setEditingHabitName(habit.name);
  }

  function saveHabitEdit(e) {
    e.preventDefault();

    if (!editingHabitName.trim()) return;

    setHabits(previous =>
      previous.map(habit =>
        habit.id === editingHabitId
          ? { ...habit, name: editingHabitName.trim() }
          : habit
      )
    );

    setEditingHabitId(null);
    setEditingHabitName("");
  }

  function cancelHabitEdit() {
    setEditingHabitId(null);
    setEditingHabitName("");
  }

  function deleteHabit(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this habit? Its completion history will also be removed."
    );

    if (!confirmed) return;

    setHabits(previous =>
      previous.filter(habit => habit.id !== id)
    );

    setCompletedDays(previous => {
      const updated = {};

      Object.entries(previous).forEach(([day, completedIds]) => {
        updated[day] = completedIds.filter(item => item !== id);
      });

      return updated;
    });

    if (editingHabitId === id) {
      cancelHabitEdit();
    }
  }

  // PRAYER FUNCTIONS
  function togglePrayer(prayer) {
    setPrayerHistory(previous => {
      const current = previous[today] || [];

      const updated = current.includes(prayer)
        ? current.filter(item => item !== prayer)
        : [...current, prayer];

      return { ...previous, [today]: updated };
    });
  }

  // WATER FUNCTIONS
  function updateWater(index) {
    const newCount = waterCount >= index + 1
      ? index
      : index + 1;

    setWaterHistory(previous => ({
      ...previous,
      [today]: newCount,
    }));
  }

  // FINANCE FUNCTIONS
  function addFinanceTransaction(e) {
    e.preventDefault();

    const amount = Number(transactionAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    if (!transactionDate) {
      alert("Please select a transaction date.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type: transactionType,
      amount,
      category: transactionCategory,
      date: transactionDate,
      note: transactionNote.trim(),
    };

    setFinanceTransactions(previous => [
      newTransaction,
      ...previous,
    ]);

    setTransactionAmount("");
    setTransactionNote("");
    setTransactionDate(today);
  }

  function deleteFinanceTransaction(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    setFinanceTransactions(previous =>
      previous.filter(item => item.id !== id)
    );
  }

  // JOURNAL FUNCTIONS
  function saveJournalEntry(e) {
    e.preventDefault();

    if (!journalDraft.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: today,
      mood: selectedMood,
      text: journalDraft.trim(),
    };

    setJournalEntries(previous => [newEntry, ...previous]);
    setJournalDraft("");
    setSelectedMood(moods[0]);
  }

  function deleteJournalEntry(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this journal entry?"
    );

    if (!confirmed) return;

    setJournalEntries(previous =>
      previous.filter(entry => entry.id !== id)
    );
  }

  // LAST SEVEN CALENDAR DAYS
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      key: getDateKey(date),
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });

  const weeklyData = lastSevenDays.map(day => {
    const habitCount = habits.filter(habit =>
      (completedDays[day.key] || []).includes(habit.id)
    ).length;

    const habitPercent = habits.length
      ? Math.round((habitCount / habits.length) * 100)
      : 0;

    const prayerCount = (prayerHistory[day.key] || []).length;
    const waterCountForDay = waterHistory[day.key] || 0;

    return {
      ...day,
      habitCount,
      habitPercent,
      prayerCount,
      waterCount: waterCountForDay,
    };
  });

  const weeklyPrayerTotal = weeklyData.reduce(
    (sum, day) => sum + day.prayerCount,
    0
  );

  const weeklyWaterDays = weeklyData.filter(
    day => day.waterCount >= WATER_GOAL
  ).length;

  const weeklyHabitAverage = Math.round(
    weeklyData.reduce((sum, day) => sum + day.habitPercent, 0) / 7
  );

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>♡ Becoming Her</h2>
        <p className="tagline">Small steps. Stronger habits.</p>

        <nav>
          {[
            "Today",
            "Habits",
            "Prayer",
            "Water",
            "Progress",
            "Finance",
            "Self-care",
            "Journal",
          ].map(item => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-quote">
          "Become the woman you keep dreaming about."
        </div>
      </aside>

      <main className="main">
        <header>
          <span>{date}</span>
          <span className="profile">♡ Your growth space</span>
        </header>

        {/* TODAY */}
        {tab === "Today" && (
          <>
            <section className="welcome">
              <p>WELCOME TO YOUR SPACE</p>
              <h1>Show up for <em>yourself.</em></h1>
              <span>Today is another opportunity to grow.</span>
            </section>

            <section className="stats">
              <div className="stat-card">
                <span>Daily habits</span>
                <h2>{completed}/{habits.length}</h2>
                <div className="progress">
                  <div style={{ width: `${progress}%` }} />
                </div>
                <small>{progress}% completed</small>
              </div>

              <div className="stat-card">
                <span>Your mindset</span>
                <h2>Keep growing ♡</h2>
                <small>Progress, not perfection.</small>
              </div>
            </section>

            <section className="content-card">
              <h2>Today's little promises</h2>

              {habits.map(habit => (
                <label className="habit" key={habit.id}>
                  <input
                    type="checkbox"
                    checked={completedToday.includes(habit.id)}
                    onChange={() => toggleHabit(habit.id)}
                  />
                  <span>{habit.name}</span>
                </label>
              ))}
            </section>
          </>
        )}

        {/* HABITS */}
        {tab === "Habits" && (
          <section className="content-card page">
            <h1>Build your habits.</h1>
            <p>Small actions create lasting change.</p>

            <form onSubmit={addHabit}>
              <input
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                placeholder="Add a new habit..."
              />
              <button className="primary" type="submit">
                Add habit +
              </button>
            </form>

            <h2 style={{ marginTop: "25px" }}>Your habits</h2>

            {habits.length === 0 && (
              <p>You have no habits yet. Add your first one above. ♡</p>
            )}

            {habits.map(habit => (
              <div
                key={habit.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  padding: "12px 0",
                  borderBottom: "1px solid #eee0e7",
                  flexWrap: "wrap",
                }}
              >
                {editingHabitId === habit.id ? (
                  <form
                    onSubmit={saveHabitEdit}
                    style={{
                      display: "flex",
                      gap: "8px",
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      value={editingHabitName}
                      onChange={e => setEditingHabitName(e.target.value)}
                      autoFocus
                      required
                      placeholder="Enter habit name"
                    />

                    <button type="submit" className="primary">
                      Save
                    </button>

                    <button type="button" onClick={cancelHabitEdit}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <label
                      className="habit"
                      style={{ flex: 1, margin: 0 }}
                    >
                      <input
                        type="checkbox"
                        checked={completedToday.includes(habit.id)}
                        onChange={() => toggleHabit(habit.id)}
                      />
                      <span>{habit.name}</span>
                    </label>

                    <div style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}>
                      <button
                        type="button"
                        onClick={() => startEditing(habit)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </section>
        )}

        {/* PRAYER */}
        {tab === "Prayer" && (
          <section className="content-card page">
            <h1>My Salah Journey. 🤍</h1>
            <p>Five daily prayers. One beautiful connection with Allah.</p>

            <div className="prayer-summary">
              <h2>{todaysPrayers.length}/5</h2>
              <p>Prayers completed today</p>
              <div className="progress">
                <div style={{ width: `${prayerProgress}%` }} />
              </div>
              <small>{prayerProgress}% completed</small>
            </div>

            {prayers.map(prayer => (
              <label className="habit" key={prayer}>
                <input
                  type="checkbox"
                  checked={todaysPrayers.includes(prayer)}
                  onChange={() => togglePrayer(prayer)}
                />
                <span>{prayer}</span>
              </label>
            ))}

            <small>Your prayer records save automatically on this device.</small>
          </section>
        )}

        {/* WATER */}
        {tab === "Water" && (
          <section className="content-card page">
            <h1>Stay hydrated. 💧</h1>
            <p>Take care of your body, one glass at a time.</p>

            <div className="prayer-summary">
              <h2>{waterAmount.toLocaleString()} ml</h2>
              <p>Daily goal: 2,000 ml</p>
              <div className="progress">
                <div style={{ width: `${waterProgress}%` }} />
              </div>
              <small>{waterCount}/8 glasses · {waterProgress}% completed</small>
            </div>

            <h2>Your daily glasses</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "12px",
              margin: "20px 0",
            }}>
              {Array.from({ length: WATER_GOAL }, (_, index) => {
                const filled = waterCount >= index + 1;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => updateWater(index)}
                    aria-label={`Glass ${index + 1}`}
                    aria-pressed={filled}
                    style={{
                      border: filled ? "2px solid #d47ca5" : "2px solid #eadce4",
                      borderRadius: "14px",
                      padding: "14px 5px",
                      background: filled ? "#fce6f0" : "#fff9fc",
                      cursor: "pointer",
                      color: "#75445e",
                      fontSize: "25px",
                    }}
                  >
                    <span>{filled ? "🥛" : "🥤"}</span>
                    <span style={{
                      display: "block",
                      fontSize: "11px",
                      marginTop: "6px",
                    }}>
                      {index + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <p>Each glass represents 250 ml. Tap a glass to update your progress.</p>

            {waterCount === WATER_GOAL && (
              <p>🎉 You reached your daily water goal. Well done!</p>
            )}

            <small>Your water intake saves automatically on this device.</small>
          </section>
        )}

        {/* PROGRESS */}
        {tab === "Progress" && (
          <section className="content-card page">
            <h1>Your growth journey. 🌷</h1>
            <p>Look at your progress over the last seven days.</p>

            <div className="stats">
              <div className="stat-card">
                <span>Habit consistency</span>
                <h2>{weeklyHabitAverage}%</h2>
                <small>Weekly average</small>
              </div>

              <div className="stat-card">
                <span>Obligatory prayers</span>
                <h2>{weeklyPrayerTotal}/35</h2>
                <small>Across seven days</small>
              </div>

              <div className="stat-card">
                <span>Water goals reached</span>
                <h2>{weeklyWaterDays}/7</h2>
                <small>Days with 2 litres logged</small>
              </div>
            </div>

            <h2>Daily breakdown</h2>

            {weeklyData.map(day => (
              <div
                key={day.key}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #eee0e7",
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "8px",
                }}>
                  <strong>{day.day}, {day.date}</strong>
                  <small>{day.habitPercent}% habits</small>
                </div>

                <div className="progress">
                  <div style={{ width: `${day.habitPercent}%` }} />
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "9px",
                }}>
                  <small>♡ Habits: {day.habitCount}/{habits.length}</small>
                  <small>🌙 Salah: {day.prayerCount}/5</small>
                  <small>💧 Water: {day.waterCount}/8</small>
                </div>
              </div>
            ))}

            <small style={{ display: "block", marginTop: "16px" }}>
              Your history is stored on this device. Habit percentages use your current habit list.
            </small>
          </section>
        )}

        {/* FINANCE */}
        {tab === "Finance" && (
          <section className="content-card page">
            <h1>My money, my responsibility. 💰</h1>
            <p>Be intentional about every Dalasi.</p>

            <div className="stats">
              <div className="stat-card">
                <span>Total income</span>
                <h2>{formatDalasi(totalIncome)}</h2>
              </div>

              <div className="stat-card">
                <span>Total expenses</span>
                <h2>{formatDalasi(totalExpenses)}</h2>
              </div>

              <div className="stat-card">
                <span>Available balance</span>
                <h2>{formatDalasi(availableBalance)}</h2>
              </div>
            </div>

            <div style={{
              marginTop: "28px",
              padding: "22px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #fff4f8, #fffafd)",
              border: "1px solid #f0dce6",
            }}>
              <h2 style={{
                marginTop: 0,
                marginBottom: "6px",
                color: "#75445e",
              }}>
                Add a transaction
              </h2>

              <p style={{
                marginTop: 0,
                marginBottom: "22px",
                fontSize: "13px",
                color: "#a0788d",
              }}>
                Every Dalasi deserves a record. ♡
              </p>

              <form className="transaction-form" onSubmit={addFinanceTransaction}>
                <label style={financeLabelStyle}>
                  What are you recording?
                </label>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "22px",
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType("expense");
                      setTransactionCategory("Food");
                    }}
                    style={{
                      padding: "13px",
                      borderRadius: "12px",
                      border: transactionType === "expense"
                        ? "2px solid #d47ca5"
                        : "1px solid #eadce4",
                      background: transactionType === "expense"
                        ? "#fce6f0"
                        : "#fff",
                      color: "#75445e",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ↗ Expense
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType("income");
                      setTransactionCategory("Salary");
                    }}
                    style={{
                      padding: "13px",
                      borderRadius: "12px",
                      border: transactionType === "income"
                        ? "2px solid #d47ca5"
                        : "1px solid #eadce4",
                      background: transactionType === "income"
                        ? "#fce6f0"
                        : "#fff",
                      color: "#75445e",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ↙ Income
                  </button>
                </div>

                <label style={financeLabelStyle}>
                  How much? 
                </label>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "15px 18px",
                  marginBottom: "22px",
                  borderRadius: "15px",
                  border: "1px solid #e8cbd9",
                  background: "#ffffff",
                  boxShadow: "0 3px 12px rgba(180, 110, 145, 0.06)",
                }}>
                  <span style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#c1789c",
                  }}>
                    D
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={transactionAmount}
                    onChange={e => setTransactionAmount(e.target.value)}
                    placeholder="0.00"
                    aria-label="Transaction amount in Gambian Dalasi"
                    style={{
                      width: "100%",
                      minWidth: 0,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "#75445e",
                      fontSize: "27px",
                      fontWeight: "600",
                      padding: "3px 0",
                      margin: 0,
                      boxShadow: "none",
                    }}
                  />
                  <span style={{
                    fontSize: "12px",
                    color: "#b28b9f",
                    whiteSpace: "nowrap",
                  }}>
                    GMD
                  </span>
                </div>

                <label style={financeLabelStyle}>
                  Category
                </label>

                <select
                  value={transactionCategory}
                  onChange={e => setTransactionCategory(e.target.value)}
                  style={financeFieldStyle}
                >
                  {(transactionType === "income"
                    ? incomeCategories
                    : expenseCategories
                  ).map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <label style={financeLabelStyle}>
                  Transaction date
                </label>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  marginBottom: "22px",
                  borderRadius: "13px",
                  border: "1px solid #e8cbd9",
                  background: "#ffffff",
                }}>
                  <span style={{ fontSize: "21px" }}>📅</span>

                  <input
                    type="date"
                    required
                    value={transactionDate}
                    onChange={e => setTransactionDate(e.target.value)}
                    aria-label="Transaction date"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      width: "100%",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "#75445e",
                      fontSize: "15px",
                      padding: "3px 0",
                      margin: 0,
                      boxShadow: "none",
                    }}
                  />
                </div>

                <label style={financeLabelStyle}>
                  A little note (optional)
                </label>

                <input
                  type="text"
                  value={transactionNote}
                  onChange={e => setTransactionNote(e.target.value)}
                  placeholder="What was this transaction for?"
                  style={financeFieldStyle}
                />

                <button
                  type="submit"
                  className="primary"
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "13px",
                    marginTop: "3px",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  Save transaction ♡
                </button>
              </form>
            </div>

            <div style={{ marginTop: "35px" }}>
              <h2>Transaction history</h2>

              {financeTransactions.length === 0 ? (
                <div className="care-item">
                  No transactions yet. Start by recording your first income or expense. 🤍
                </div>
              ) : (
                financeTransactions
                  .slice()
                  .sort((a, b) =>
                    b.date.localeCompare(a.date) || b.id - a.id
                  )
                  .map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        padding: "15px 0",
                        borderBottom: "1px solid #eee0e7",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <strong>{item.category}</strong>

                        <small style={{
                          display: "block",
                          marginTop: "5px",
                        }}>
                          {formatJournalDate(item.date)}
                        </small>

                        {item.note && (
                          <small style={{
                            display: "block",
                            marginTop: "4px",
                          }}>
                            {item.note}
                          </small>
                        )}
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <strong style={{
                          color: item.type === "income" ? "#27845b" : "#b45c78",
                        }}>
                          {item.type === "income" ? "+" : "-"}
                          {formatDalasi(item.amount)}
                        </strong>

                        <button
                          type="button"
                          onClick={() => deleteFinanceTransaction(item.id)}
                          style={{
                            display: "block",
                            marginTop: "6px",
                            marginLeft: "auto",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <small style={{ display: "block", marginTop: "20px" }}>
              Your financial records are saved locally in this browser.
            </small>
          </section>
        )}

        {/* SELF-CARE */}
        {tab === "Self-care" && (
          <section className="content-card page">
            <h1>Take care of you.</h1>
            <p>Self-care is part of your growth.</p>
            <div className="care-item">💧 Drink enough water</div>
            <div className="care-item">🌷 Move your body</div>
            <div className="care-item">🫧 Make time to rest</div>
            <div className="care-item">🧴 Care for your skin</div>
            <div className="care-item">🤍 Give yourself grace</div>
          </section>
        )}

        {/* JOURNAL */}
        {tab === "Journal" && (
          <section className="content-card page">
            <h1>Dear me... 🤍</h1>
            <p>A safe little space to be honest with yourself.</p>

            <form onSubmit={saveJournalEntry}>
              <label
                htmlFor="journal-mood"
                style={{ display: "block", marginBottom: "8px" }}
              >
                How are you feeling today?
              </label>

              <select
                id="journal-mood"
                value={selectedMood}
                onChange={e => setSelectedMood(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #eadce4",
                  background: "#fff9fc",
                  color: "#75445e",
                  marginBottom: "18px",
                  fontSize: "15px",
                }}
              >
                {moods.map(mood => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>

              <label
                htmlFor="journal-text"
                style={{ display: "block", marginBottom: "8px" }}
              >
                What's on your mind?
              </label>

              <textarea
                id="journal-text"
                value={journalDraft}
                onChange={e => setJournalDraft(e.target.value)}
                placeholder="Dear me, today I feel..."
                rows={7}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "1px solid #eadce4",
                  background: "#fff9fc",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  resize: "vertical",
                }}
              />

              <button
                type="submit"
                className="primary"
                disabled={!journalDraft.trim()}
                style={{ marginTop: "12px" }}
              >
                Save my reflection ♡
              </button>
            </form>

            <small style={{ display: "block", marginTop: "12px" }}>
              Your entries are saved in this browser on this device.
            </small>

            <div style={{ marginTop: "35px" }}>
              <h2>Your reflections 🌷</h2>

              {journalEntries.length === 0 ? (
                <div className="care-item">
                  Your diary is waiting for your first entry. Start writing, beautiful. 🤍
                </div>
              ) : (
                <p>
                  You've saved {journalEntries.length}{" "}
                  {journalEntries.length === 1 ? "reflection" : "reflections"}.
                </p>
              )}

              {journalEntries.map(entry => (
                <article
                  key={entry.id}
                  style={{
                    background: "#fff9fc",
                    border: "1px solid #eadce4",
                    borderRadius: "14px",
                    padding: "18px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}>
                    <div>
                      <strong>{formatJournalDate(entry.date)}</strong>
                      <p style={{ margin: "8px 0", color: "#9b6480" }}>
                        {entry.mood}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteJournalEntry(entry.id)}
                      aria-label="Delete journal entry"
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#a45d7e",
                        cursor: "pointer",
                        padding: "5px",
                      }}
                    >
                      Delete 🗑️
                    </button>
                  </div>

                  <p style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.7",
                    overflowWrap: "anywhere",
                  }}>
                    {entry.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <footer>Made for the woman you are becoming. ♡</footer>
      </main>
    </div>
  );
}

export default App;
